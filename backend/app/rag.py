from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .db import PINECONE_INDEX_NAME, PINECONE_API_KEY
import os

# Embeddings are built lazily and served by Pinecone's hosted inference API.
#
# Two problems drove this. First, building the model at import time meant that a
# missing sentence-transformers, a failed model download, or a cold-start OOM
# raised during import and took the ENTIRE API down -- no health check, no error
# page, just a failed deploy. Second, running MiniLM locally pulls in torch:
# ~2GB of dependencies and over a gigabyte of RAM, which rules out every small
# free host.
#
# Pinecone already holds the vectors and embeds text server-side on the free
# plan, so using it removes torch from the dependency tree entirely. A local
# model is still honoured if EMBEDDING_BACKEND=local, for anyone who wants
# offline operation.
#
# Retrieval is an enhancement, not a hard requirement: any failure degrades to
# "no retrieved context" and the viva still runs.

EMBEDDING_BACKEND = os.getenv("EMBEDDING_BACKEND", "pinecone").lower()
LOCAL_EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

_embeddings = None
_embeddings_failed = False
_index_ready = False
_effective_index = PINECONE_INDEX_NAME


def get_embeddings():
    """Return the embedding model, or None if it cannot be loaded."""
    global _embeddings, _embeddings_failed
    if _embeddings is not None or _embeddings_failed:
        return _embeddings

    try:
        if EMBEDDING_BACKEND == "local":
            from langchain_huggingface import HuggingFaceEmbeddings

            _embeddings = HuggingFaceEmbeddings(model_name=LOCAL_EMBEDDING_MODEL)
        else:
            from .embeddings import PineconeInferenceEmbeddings

            _embeddings = PineconeInferenceEmbeddings(api_key=PINECONE_API_KEY)
    except Exception as exc:  # noqa: BLE001
        _embeddings_failed = True
        print(f"WARNING: embeddings unavailable ({type(exc).__name__}: {exc}). "
              f"Retrieval will return no context; the viva still runs.")
    return _embeddings


# Backwards compatibility for any module that imported `embeddings` directly.
embeddings = None


def _ensure_index():
    """Resolve which Pinecone index to use, creating it if necessary.

    The hosted embedding models are 1024-dimensional while the original local
    MiniLM was 384, and Pinecone rejects any upsert whose dimension does not
    match the index. Rather than silently failing against a pre-existing
    384-d index -- or destructively deleting it -- this detects the mismatch
    and transparently uses a dimension-suffixed index alongside it, creating
    it on demand so a fresh deployment needs no manual console step.
    """
    global _index_ready, _effective_index
    if _index_ready or EMBEDDING_BACKEND == "local" or not PINECONE_API_KEY:
        return _effective_index
    try:
        from pinecone import Pinecone, ServerlessSpec
        from .embeddings import EMBED_DIMENSION

        pc = Pinecone(api_key=PINECONE_API_KEY)
        existing = {i["name"]: i for i in pc.list_indexes()}
        name = PINECONE_INDEX_NAME

        current = existing.get(name)
        if current is not None and current.get("dimension") != EMBED_DIMENSION:
            name = f"{PINECONE_INDEX_NAME}-{EMBED_DIMENSION}"
            print(f"[RAG] '{PINECONE_INDEX_NAME}' is "
                  f"{current.get('dimension')}d but the embedding model is "
                  f"{EMBED_DIMENSION}d; using '{name}' instead.")

        if name not in existing:
            print(f"[RAG] Creating Pinecone index '{name}' "
                  f"({EMBED_DIMENSION}d, cosine)...")
            pc.create_index(
                name=name,
                dimension=EMBED_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            # Creation is asynchronous; wait until it accepts writes.
            import time
            for _ in range(60):
                if pc.describe_index(name).status.get("ready"):
                    break
                time.sleep(2)

        _effective_index = name
        _index_ready = True
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: could not verify Pinecone index: {exc}")
    return _effective_index


def get_vectorstore():
    """Return a Pinecone vector store, or None if it is not usable."""
    model = get_embeddings()
    if model is None or not PINECONE_API_KEY:
        return None
    index_name = _ensure_index()
    try:
        return PineconeVectorStore(
            index_name=index_name,
            embedding=model,
            pinecone_api_key=PINECONE_API_KEY
        )
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: Pinecone vector store unavailable: {exc}")
        return None


def retrieve_context(query: str, k: int = 3, session_id: str = None):
    vectorstore = get_vectorstore()
    if vectorstore is None:
        return []
    
    # CRITICAL: Only retrieve documents from the CURRENT session
    if session_id:
        filter_dict = {"session_id": {"$eq": session_id}}
        print(f"[RAG] Retrieving with session filter: {filter_dict}")
        
        # Request significantly more documents to ensure diversity
        # Pinecone often returns duplicates of high-scoring chunks
        fetch_k = k * 10
        raw_results = vectorstore.similarity_search(query, k=fetch_k, filter=filter_dict)
        
        print(f"[RAG] Retrieved {len(raw_results)} raw documents (requested {fetch_k})")
        
        # Strict Deduplication
        seen_hashes = set()
        unique_results = []
        
        for doc in raw_results:
            # Use content as the source of truth for uniqueness
            content_hash = hash(doc.page_content.strip())
            
            if content_hash not in seen_hashes:
                seen_hashes.add(content_hash)
                unique_results.append(doc)
            
            # Stop once we have enough unique documents
            if len(unique_results) >= k:
                break
        
        print(f"[RAG] Returning {len(unique_results)} unique documents after deduplication")
        
        return unique_results
    else:
        # If no session_id, don't retrieve anything to avoid contamination
        print("[RAG] WARNING: No session_id provided, returning empty results")
        return []

def index_text(text: str, metadata: dict = None):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,        # Reduced to fit MiniLM-L6-v2 limit better (256 tokens)
        chunk_overlap=50,
        length_function=len,
        separators=["\n\n\n", "\n\n", "\n", ". ", " ", ""]
    )
    chunks = text_splitter.split_text(text)
    
    
    # Deduplicate chunks (remove exact duplicates)
    unique_chunks = []
    seen = set()
    for chunk in chunks:
        chunk_hash = hash(chunk.strip())
        if chunk_hash not in seen:
            seen.add(chunk_hash)
            unique_chunks.append(chunk)
    
    print(f"[RAG] Indexing {len(unique_chunks)} unique chunks")
    
    vectorstore = get_vectorstore()
    if vectorstore is None:
        print("[RAG] Skipping indexing - vector store unavailable.")
        return
    if unique_chunks:
        import uuid
        # Generate explicit IDs to ensure uniqueness and traceability
        ids = [str(uuid.uuid4()) for _ in unique_chunks]
        
        # Create metadata list with COPIES to avoid shared reference bug
        metadatas_list = [metadata.copy() for _ in unique_chunks] if metadata else None
        
        print(f"[RAG] Adding {len(unique_chunks)} chunks to Pinecone")
        vectorstore.add_texts(unique_chunks, metadatas=metadatas_list, ids=ids)
        print(f"[RAG] Successfully added chunks to Pinecone")

async def process_and_index_document(file_content: bytes, filename: str, metadata: dict = None):
    from pypdf import PdfReader
    import io

    text = ""
    if filename.lower().endswith('.pdf'):
        try:
            reader = PdfReader(io.BytesIO(file_content))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return
    else:
        # Assume text
        try:
            text = file_content.decode('utf-8')
        except:
            text = file_content.decode('latin-1')
            
    if text.strip():
        index_text(text, metadata)

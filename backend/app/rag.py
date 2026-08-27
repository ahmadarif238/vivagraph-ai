from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .db import PINECONE_INDEX_NAME, PINECONE_API_KEY
import os

# Embeddings are built lazily.
#
# This used to run at import time, which meant that if sentence-transformers
# was missing, the model download failed, or the host ran out of memory during
# a cold start, importing `rag` raised and took the ENTIRE API down with it -
# no health check, no error page, just a failed deploy. Retrieval is an
# enhancement here, not a hard requirement, so a failure now degrades to
# "no retrieved context" instead of killing the process.
#
# The Pinecone index is 384-dimensional, so the model must stay
# all-MiniLM-L6-v2 unless the index is rebuilt.
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

_embeddings = None
_embeddings_failed = False


def get_embeddings():
    """Return the embedding model, or None if it cannot be loaded."""
    global _embeddings, _embeddings_failed
    if _embeddings is not None or _embeddings_failed:
        return _embeddings
    try:
        from langchain_huggingface import HuggingFaceEmbeddings

        _embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    except Exception as exc:  # noqa: BLE001
        _embeddings_failed = True
        print(f"WARNING: embeddings unavailable ({type(exc).__name__}: {exc}). "
              f"Retrieval will return no context; the viva still runs.")
    return _embeddings


# Backwards compatibility for any module that imported `embeddings` directly.
embeddings = None


def get_vectorstore():
    """Return a Pinecone vector store, or None if it is not usable."""
    model = get_embeddings()
    if model is None or not PINECONE_API_KEY:
        return None
    try:
        return PineconeVectorStore(
            index_name=PINECONE_INDEX_NAME,
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

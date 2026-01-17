from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .db import PINECONE_INDEX_NAME, PINECONE_API_KEY
import os

# Initialize Embeddings
# Using sentence-transformers/all-MiniLM-L6-v2 as a robust local default.
# If "llama-text-embed-v2" is required via a specific provider, that configuration should be added here.
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def get_vectorstore():
    return PineconeVectorStore(
        index_name=PINECONE_INDEX_NAME,
        embedding=embeddings,
        pinecone_api_key=PINECONE_API_KEY
    )

def retrieve_context(query: str, k: int = 3, session_id: str = None):
    vectorstore = get_vectorstore()
    
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

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
        # Use Pinecone's metadata filtering format
        filter_dict = {"session_id": {"$eq": session_id}}
        print(f"[RAG] Retrieving with session filter: {filter_dict}")
        results = vectorstore.similarity_search(query, k=k, filter=filter_dict)
        
        # Debug: Log what was retrieved with FULL content
        print(f"[RAG] Retrieved {len(results)} documents for session {session_id}")
        
        seen_hashes = set()
        duplicate_count = 0
        
        if results:
            for i, doc in enumerate(results):
                doc_session = doc.metadata.get("session_id", "NO_SESSION_ID")
                content_hash = hash(doc.page_content)
                is_duplicate = content_hash in seen_hashes
                
                if is_duplicate:
                    duplicate_count += 1
                    print(f"[RAG] Doc {i}: **DUPLICATE** (hash={content_hash})")
                else:
                    seen_hashes.add(content_hash)
                    print(f"[RAG] Doc {i}: session_id={doc_session}, hash={content_hash}")
                    print(f"[RAG] Doc {i} FULL CONTENT ({len(doc.page_content)} chars):")
                    print(f"[RAG] {doc.page_content}")
                    print(f"[RAG] --- End Doc {i} ---\n")
        
        if duplicate_count > 0:
            print(f"[RAG] WARNING: Found {duplicate_count} duplicate documents in retrieval!")
        
        return results
    else:
        # If no session_id, don't retrieve anything to avoid contamination
        print("[RAG] WARNING: No session_id provided, returning empty results")
        return []

def index_text(text: str, metadata: dict = None):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=50,     # Further reduced overlap
        length_function=len,
        separators=["\n\n\n", "\n\n", "\n", ". ", " ", ""]  # Split on multiple newlines first
    )
    chunks = text_splitter.split_text(text)
    
    # Debug: Log all chunks before deduplication
    print(f"\n[RAG] === Document Chunking Debug ===")
    print(f"[RAG] Total document length: {len(text)} characters")
    print(f"[RAG] Generated {len(chunks)} chunks")
    for i, chunk in enumerate(chunks):
        print(f"[RAG] Chunk {i}: {len(chunk)} chars, starts with: {chunk[:150]}...")
    
    # Deduplicate chunks (remove exact duplicates)
    unique_chunks = []
    seen = set()
    for chunk in chunks:
        chunk_hash = hash(chunk.strip())
        if chunk_hash not in seen:
            seen.add(chunk_hash)
            unique_chunks.append(chunk)
        else:
            print(f"[RAG] WARNING: Duplicate chunk detected and removed")
    
    print(f"[RAG] Indexing {len(unique_chunks)} unique chunks (from {len(chunks)} total)")
    print(f"[RAG] Metadata being attached: {metadata}")
    print(f"[RAG] === End Debug ===\n")
    
    vectorstore = get_vectorstore()
    if unique_chunks:
        # Create metadata list
        metadatas_list = [metadata] * len(unique_chunks) if metadata else None
        print(f"[RAG] Adding {len(unique_chunks)} chunks to Pinecone with metadata: {metadatas_list}")
        vectorstore.add_texts(unique_chunks, metadatas=metadatas_list)
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

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
    filter_dict = {"session_id": session_id} if session_id else None
    return vectorstore.similarity_search(query, k=k, filter=filter_dict)

def index_text(text: str, metadata: dict = None):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)
    vectorstore = get_vectorstore()
    vectorstore.add_texts(chunks, metadatas=[metadata] * len(chunks) if metadata else None)

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

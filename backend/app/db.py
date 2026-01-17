import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

# Supabase Setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Pinecone Setup
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "ai-viva-and-coaching-agent")

if not PINECONE_API_KEY:
    raise ValueError("Pinecone API Key must be set in .env")

pc = Pinecone(api_key=PINECONE_API_KEY)

def get_pinecone_index():
    # Check if index exists, if not create it (though instructions say it should exist)
    # This function returns the index object
    return pc.Index(PINECONE_INDEX_NAME)

# Test connections (Optional, can be called from main)
def check_connections():
    try:
        # Simple Supabase check
        # supabase.table("users").select("*").limit(1).execute()
        print("Supabase client initialized.")
    except Exception as e:
        print(f"Supabase connection error: {e}")

    try:
        # Simple Pinecone check
        idx = get_pinecone_index()
        stats = idx.describe_index_stats()
        print(f"Pinecone connected. Stats: {stats}")
    except Exception as e:
        print(f"Pinecone connection error: {e}")

if __name__ == "__main__":
    check_connections()

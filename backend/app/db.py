"""Datastore clients (Supabase + Pinecone).

Hardened (2026-08). Previously this module raised `ValueError` at import time
whenever a key was missing, so a single expired credential took the entire API
down with an import error rather than degrading. It now:

  * probes Supabase once and falls back to `LocalSupabase` (a SQLite-backed
    stand-in with the same query-builder API) when it is missing or unreachable,
  * never raises on import, so the service always boots.

Set SUPABASE_URL and SUPABASE_KEY to a live project to use the real backend.
"""

import os

from dotenv import load_dotenv
from pinecone import Pinecone

from app.local_db import LocalSupabase

load_dotenv()

# --- Supabase (with local fallback) ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip().strip('"')
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip().strip('"')

supabase = None
USING_LOCAL_DB = False


def _build_supabase():
    """Return a live Supabase client, or None if it is unusable."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("INFO: SUPABASE_URL/SUPABASE_KEY not set - using local SQLite store.")
        return None
    try:
        from supabase import create_client

        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Cheap round-trip: proves DNS, TLS and auth before we commit to it.
        client.table("users").select("id").limit(1).execute()
        return client
    except Exception as exc:  # noqa: BLE001 - any failure means "fall back"
        print(f"WARNING: Supabase unreachable ({type(exc).__name__}: {exc}). "
              f"Using local SQLite store so the app still works.")
        return None


supabase = _build_supabase()
if supabase is None:
    supabase = LocalSupabase()
    USING_LOCAL_DB = True


# --- Pinecone ---
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "").strip().strip('"')
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "ai-viva-and-coaching-agent")

pc = Pinecone(api_key=PINECONE_API_KEY) if PINECONE_API_KEY else None
if pc is None:
    print("WARNING: PINECONE_API_KEY not set - retrieval will return no context.")


def get_pinecone_index():
    """Return the Pinecone index, or None if Pinecone is not configured/available."""
    if pc is None:
        return None
    try:
        return pc.Index(PINECONE_INDEX_NAME)
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: Pinecone index '{PINECONE_INDEX_NAME}' unavailable: {exc}")
        return None


def check_connections():
    print(f"Datastore: {'LOCAL SQLite fallback' if USING_LOCAL_DB else 'Supabase'}")
    idx = get_pinecone_index()
    if idx is None:
        print("Pinecone: not available.")
        return
    try:
        print(f"Pinecone connected. Stats: {idx.describe_index_stats()}")
    except Exception as exc:  # noqa: BLE001
        print(f"Pinecone connection error: {exc}")


if __name__ == "__main__":
    check_connections()

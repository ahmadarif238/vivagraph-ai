"""Embeddings backed by Pinecone's hosted inference API.

Why this exists
---------------
The original setup ran `sentence-transformers/all-MiniLM-L6-v2` locally, which
drags in torch + transformers -- roughly 2GB of dependencies and well over a
gigabyte of RAM at load. That is fine on a large machine but it rules out every
small free host, and it made cold starts slow and fragile (a failed model
download used to take the whole API down).

Pinecone is already a dependency and already holds the vectors, and its hosted
inference endpoint embeds text server-side on the free plan. Using it removes
torch from the dependency tree entirely, so the service fits comfortably in a
512MB container.

Note on `input_type`: the e5 family is trained asymmetrically -- documents must
be embedded as "passage" and searches as "query". Getting this wrong quietly
degrades retrieval quality rather than raising, so the two paths are kept
distinct below.
"""

from __future__ import annotations

import os
from typing import List

# Pinecone caps how much it will embed in a single call.
_BATCH_SIZE = 96

# 1024 dimensions for both multilingual-e5-large and llama-text-embed-v2.
DEFAULT_MODEL = os.getenv("PINECONE_EMBED_MODEL", "multilingual-e5-large")
EMBED_DIMENSION = int(os.getenv("PINECONE_EMBED_DIMENSION", "1024"))


class PineconeInferenceEmbeddings:
    """Minimal LangChain-compatible embeddings adapter.

    Implements the two methods LangChain vector stores actually call,
    `embed_documents` and `embed_query`, so it can be passed straight to
    `PineconeVectorStore` in place of a local model.
    """

    def __init__(self, api_key: str, model: str = DEFAULT_MODEL):
        if not api_key:
            raise ValueError("PINECONE_API_KEY is required for hosted embeddings")
        from pinecone import Pinecone

        self._client = Pinecone(api_key=api_key)
        self.model = model

    def _embed(self, texts: List[str], input_type: str) -> List[List[float]]:
        vectors: List[List[float]] = []
        for start in range(0, len(texts), _BATCH_SIZE):
            batch = texts[start:start + _BATCH_SIZE]
            response = self._client.inference.embed(
                model=self.model,
                inputs=batch,
                parameters={"input_type": input_type, "truncate": "END"},
            )
            vectors.extend([record["values"] for record in response.data])
        return vectors

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(list(texts), "passage")

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text], "query")[0]

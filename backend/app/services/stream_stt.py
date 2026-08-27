"""Streaming speech-to-text via faster-whisper.

Hardened (2026-08): `faster_whisper` and `torch` were imported, and the model
was loaded, at module import time. Any of those failing - package not installed,
model download blocked, or not enough memory on a cold start - raised during
import and took the ENTIRE API down, because a router imports this module.

Loading is now lazy and every failure degrades to "no transcription" instead of
killing the process. (`app/stt.py` provides the hosted Groq Whisper path, which
is the one used in deployment; this local model is the offline fallback.)
"""

import os

_model = None
_load_attempted = False

MODEL_SIZE = os.getenv("WHISPER_LOCAL_MODEL", "base.en")


def get_model():
    """Load the Whisper model on first use. Returns None if unavailable."""
    global _model, _load_attempted
    if _load_attempted:
        return _model
    _load_attempted = True

    try:
        from faster_whisper import WhisperModel

        try:
            import torch

            device = "cuda" if torch.cuda.is_available() else "cpu"
        except Exception:  # noqa: BLE001 - torch is optional; CPU is a fine default
            device = "cpu"
        compute_type = "float16" if device == "cuda" else "int8"

        print(f"[STT] Loading Faster-Whisper on {device} ({compute_type})...")
        _model = WhisperModel(MODEL_SIZE, device=device, compute_type=compute_type)
        print("[STT] Model loaded successfully.")
    except Exception as exc:  # noqa: BLE001
        print(f"[STT] Local Whisper unavailable ({type(exc).__name__}: {exc}). "
              f"Streaming transcription disabled; the hosted Groq path still works.")
        _model = None
    return _model


def transcribe_audio_chunk(audio_bytes: bytes) -> str:
    """
    Transcribes a raw PCM audio chunk (16-bit, 16kHz, Mono).
    This function wraps the raw bytes into a virtual float32 numpy array for Whisper.
    """
    model = get_model()
    if not model:
        return ""

    try:
        import numpy as np

        # 1. Convert PCM bytes to numpy array (int16 -> float32)
        # Assuming 16kHz, Mono, 16-bit PCM (standard for web audio)
        audio_data = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0

        # 2. Transcribe
        segments, info = model.transcribe(
            audio_data,
            beam_size=1,
            language="en",
            vad_filter=True,
            condition_on_previous_text=False,
            temperature=0.0,
            repetition_penalty=1.2,
            no_repeat_ngram_size=2
        )

        # 3. Collect text
        text = " ".join([segment.text for segment in segments]).strip()
        return text

    except Exception as e:
        print(f"[STT] Error: {e}")
        return ""

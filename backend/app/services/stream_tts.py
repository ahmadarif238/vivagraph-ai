import edge_tts
import uuid
import os
import asyncio

# Temp directory for speech files
TEMP_DIR = "static/audio_cache"
os.makedirs(TEMP_DIR, exist_ok=True)

VOICE = "en-US-AndrewNeural" # Male voice, very natural. Options: en-US-AriaNeural, en-GB-RyanNeural etc.

async def generate_audio_stream(text: str) -> bytes:
    """
    Generates audio for the given text and returns the full byte content (mp3).
    For true streaming, we would yield chunks, but edge-tts is fast enough for sentence-level.
    """
    try:
        communicate = edge_tts.Communicate(text, VOICE)
        
        # Collect all audio data
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
                
        return audio_data
        
    except Exception as e:
        print(f"[TTS] Error: {e}")
        return None

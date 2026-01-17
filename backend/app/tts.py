import edge_tts
import uuid
import os

# Voice Mappings
VOICE_MAP = {
    "Strict": "en-US-ChristopherNeural",   # Deep, serious male
    "Moderate": "en-GB-SoniaNeural",       # Professional British female
    "Easy": "en-US-GuyNeural",             # Friendly American male
    "Listener": "en-US-GuyNeural"          # Default for listener mode
}

OUTPUT_DIR = "/tmp/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate_speech_file(text: str, strictness: str) -> str:
    """
    Generates an MP3 file using Edge TTS and returns the file path.
    """
    voice = VOICE_MAP.get(strictness, "en-GB-SoniaNeural")
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filepath)
    
    return filepath

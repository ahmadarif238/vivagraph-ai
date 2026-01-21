from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

import shutil
import tempfile

def transcribe_audio(audio_file):
    """
    Transcribes audio using Groq Whisper.
    :param audio_file: UploadFile object from FastAPI
    :return: dict with 'text' or empty dict on failure
    """
    tmp_path = None
    try:
        # 1. Save Audio Temporarily
        # Use .webm as default since that's what we send from frontend, but respect valid extensions
        suffix = os.path.splitext(audio_file.filename)[1] or ".webm"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(audio_file.file, tmp)
            tmp_path = tmp.name
            
        # 2. Check File Size (Avoid sending empty/silent files)
        file_size = os.path.getsize(tmp_path)
        print(f"🎤 Audio File Size: {file_size} bytes")
        
        if file_size < 100:
            print("⚠️ Audio file is too small (silent/empty).")
            return {"text": ""}

        # 3. Transcribe via Groq
        with open(tmp_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(tmp_path, file.read()), # Filename + Bytes
                model="whisper-large-v3",
                response_format="verbose_json",
                language="en",
                temperature=0.0
            )
        
        # Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
            
        return transcription.to_dict()

    except Exception as e:
        print(f"Transcription error: {e}")
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass
        return {}

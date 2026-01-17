from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(audio_file):
    """
    Transcribes audio using Groq Whisper.
    :param audio_file: file-like object (binary)
    :return: str transcript
    """
    try:
        transcription = client.audio.transcriptions.create(
            file=(audio_file.filename, audio_file.file, "audio/m4a"), # Assuming m4a or similar
            model="whisper-large-v3",
            response_format="verbose_json", # Changed to get segments/timestamps
            language="en",
            temperature=0.0
        )
        # Return the full object (or dict) so we can access segments/timestamps in the agent
        return transcription.to_dict() 
    except Exception as e:
        print(f"Transcription error: {e}")
        return {}

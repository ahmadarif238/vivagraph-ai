from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import time
from app.services.stream_stt import transcribe_audio_chunk
from app.services.stream_tts import generate_audio_stream
from app.graph import app_graph # Import the LangGraph
import numpy as np

router = APIRouter()

# Constants
SAMPLE_RATE = 16000 # 16kHz
CHANNELS = 1
CHUNK_SIZE_MS = 500 # 500ms chunks for transcription
BYTES_PER_SAMPLE = 2 # 16-bit
BYTES_PER_SECOND = SAMPLE_RATE * BYTES_PER_SAMPLE
CHUNK_BYTES = int(BYTES_PER_SECOND * (CHUNK_SIZE_MS / 1000.0))
SILENCE_THRESHOLD_MS = 1500 # Wait 1.5s of silence before answering

@router.websocket("/ws/realtime/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    print(f"[WS] Connection accepted for session {session_id}")
    
    # State
    audio_buffer = b""
    last_speech_time = time.time()
    is_agent_speaking = False
    current_transcript = ""
    silence_duration = 0
    
    # LangGraph Thread Config
    thread = {"configurable": {"thread_id": session_id}}
    
    try:
        while True:
            # 1. Receive Data (Audio or Control)
            # We expect raw bytes for audio, or JSON text for control
            message = await websocket.receive()
            
            if "bytes" in message:
                # --- AUDIO PROCESSING LOOP ---
                chunk = message["bytes"]
                audio_buffer += chunk
                
                # Check Interruption Logic
                # If agent is speaking, and we detect LOUD audio, stop agent.
                # (Simple amplitude check for VAD/Interruption)
                audio_arr = np.frombuffer(chunk, dtype=np.int16)
                amplitude = np.max(np.abs(audio_arr)) if len(audio_arr) > 0 else 0
                
                if is_agent_speaking and amplitude > 500: # Threshold for interruption
                     print("[WS] INTERRUPTION DETECTED!")
                     await websocket.send_json({"type": "interrupt"})
                     is_agent_speaking = False
                     # Drain TTS buffer/queue if we had one
                
                # Process Transcription if we have enough data
                if len(audio_buffer) >= CHUNK_BYTES:
                    # Transcribe the buffer
                    text_chunk = transcribe_audio_chunk(audio_buffer)
                    audio_buffer = b"" # Reset buffer (or slide window)
                    
                    if text_chunk:
                        print(f"[WS] Transcribed: {text_chunk}")
                        current_transcript += " " + text_chunk
                        last_speech_time = time.time()
                        
                        # Send partial to UI
                        await websocket.send_json({
                            "type": "transcript",
                            "text": current_transcript.strip(),
                            "is_final": False
                        })
                    else:
                        # No speech detected in this chunk
                        pass

            # --- DECISION LOOP (Silence Detection) ---
            # Check if user has stopped speaking
            time_since_speech = time.time() - last_speech_time
            
            if current_transcript.strip() and time_since_speech > (SILENCE_THRESHOLD_MS / 1000.0) and not is_agent_speaking:
                print(f"[WS] Silence detected. Committing: {current_transcript}")
                
                # 1. Notify Client: "I'm thinking..."
                await websocket.send_json({"type": "state", "status": "processing"})
                is_agent_speaking = True
                
                # 2. Run Agent (LangGraph)
                # Update state with user input
                full_text = current_transcript.strip()
                current_transcript = "" # Reset
                
                # Retrieve current history to append
                current_state = app_graph.get_state(thread)
                history = current_state.values.get("history", []) if current_state else []
                history.append({"role": "human", "content": full_text})
                
                # Update Graph State
                app_graph.update_state(thread, {"history": history})
                
                # Stream the Answer
                # We want to stream the text from the LLM -> TTS -> Client
                final_answer_text = ""
                
                # Invoke Graph (this runs typically until 'examiner' or end)
                # For streaming, we might want to just call the LLM node directly OR
                # use stream_mode="messages" if supported.
                # For simplicity in this V1, we'll wait for the full response node.
                events = app_graph.stream(None, thread, stream_mode="values")
                
                last_state = None
                for event in events:
                    last_state = event
                
                # Extract the LAST message from AI
                if last_state and "history" in last_state:
                    ai_history = [m for m in last_state["history"] if m["role"] == "ai"]
                    if ai_history:
                        answer_text = ai_history[-1]["content"]
                        
                        # Send text to UI
                        await websocket.send_json({
                            "type": "response_text",
                            "text": answer_text
                        })
                        
                        # Generate Audio
                        print(f"[WS] Generating TTS for: {answer_text[:30]}...")
                        audio_bytes = await generate_audio_stream(answer_text)
                        
                        if audio_bytes:
                            # Send Audio Bytes
                            # Header or specific msg to denote audio? 
                            # We can send binary directly. Frontend knows binary = audio to play.
                            await websocket.send_bytes(audio_bytes)
                            print("[WS] Audio sent.")
                        else:
                             print("[WS] TTS failed to generate audio.")
                
                # Reset
                # is_agent_speaking = False # Frontend tells us when it's done playing? 
                # Or we assume it's done when sent? 
                # Better: client sends "playback_complete"
                await websocket.send_json({"type": "state", "status": "listening"})
                is_agent_speaking = False # Resetting immediately for now (allows new interruption)

    except WebSocketDisconnect:
        print(f"[WS] Session {session_id} disconnected")
    except Exception as e:
        print(f"[WS] Error: {e}")
        try:
            await websocket.close()
        except:
            pass

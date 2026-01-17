from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from dotenv import load_dotenv
import os

# Load environment variables before importing other modules
load_dotenv()

from .models import AgentState, SessionCreate
from .graph import app_graph
from .db import supabase
from .stt import transcribe_audio
from .rag import process_and_index_document
from fastapi import FastAPI, HTTPException, UploadFile, File, Form

app = FastAPI(title="AI Viva and Coaching Agent")

# CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for thread config (simplified)
# In production, use a persistent checkpointer and manage thread_ids
sessions = {}

class StartRequest(BaseModel):
    topic: str
    strictness: str
    user_email: str
    mode: str = "viva" # Default to viva

class AnswerRequest(BaseModel):
    session_id: str
    transcript: str

class EndRequest(BaseModel):
    session_id: str

@app.post("/api/end")
async def end_interview(request: EndRequest):
    session_id = request.session_id
    thread = {"configurable": {"thread_id": session_id}}
    
    # Update state to force completion
    app_graph.update_state(thread, {"interview_complete": True})
    
    # Resume graph to generate feedback
    events = app_graph.stream(None, thread, stream_mode="values")
    
    last_state = None
    final_feedback = None
    
    for event in events:
        last_state = event
        if "feedback_summary" in event and event["feedback_summary"]:
            final_feedback = event["feedback_summary"]
            
    if not last_state:
         raise HTTPException(status_code=500, detail="Graph processing failed")
         
    return {
        "status": "completed",
        "feedback": final_feedback
    }

@app.post("/api/start")
async def start_viva(
    topic: str = Form(...),
    strictness: str = Form(...),
    user_email: str = Form(...),
    mode: str = Form("viva"),
    file: UploadFile = File(None)
):
    session_id = str(uuid.uuid4())
    thread = {"configurable": {"thread_id": session_id}}
    
    # If a file is provided, process and index it
    if file:
        content = await file.read()
        await process_and_index_document(content, file.filename, metadata={"session_id": session_id})
    
    # User / Mastery Logic
    mastery_level = 0
    try:
        # 1. Get or Create User
        user_resp = supabase.table("users").select("id").eq("email", user_email).execute()
        if user_resp.data:
            user_id = user_resp.data[0]["id"]
        else:
            # Create user
            user_insert = supabase.table("users").insert({"email": user_email, "full_name": user_email.split("@")[0]}).execute()
            user_id = user_insert.data[0]["id"]
            
        # 2. Get Mastery
        mastery_resp = supabase.table("topic_mastery").select("mastery_level").eq("user_id", user_id).eq("topic", topic).execute()
        if mastery_resp.data:
            mastery_level = mastery_resp.data[0]["mastery_level"]
            
        # 3. Create Session Record (Initial)
        supabase.table("sessions").insert({
            "id": session_id,
            "user_id": user_id,
            "topic": topic,
            "strictness_level": strictness
        }).execute()
            
    except Exception as e:
        print(f"Error in user/mastery fetch: {e}")
        # Proceed with defaults if DB fails
    
    initial_state = AgentState(
        session_id=session_id,
        topic=topic,
        strictness_level=strictness,
        history=[],
        evaluations=[],
        topic_mastery=mastery_level,
        interview_stage="intro",
        mode=mode,
        presentation_stage="speaking" if mode == "presentation" else "qa" # Default to qa logic for viva (interactive)
    )
    
    # store in global dict for referencing connection (not needed if using MemorySaver correctly per request)
    
    # Run graph until interrupt (after examiner asks question)
    try:
        events = app_graph.stream(initial_state, thread, stream_mode="values")
        
        last_state = None
        for event in events:
            last_state = event
            # print(event) 
        
        if not last_state:
            raise HTTPException(status_code=500, detail="Graph execution returned no state")
            
    except Exception as e:
        import traceback
        error_msg = f"Graph Logic failed: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=str(e))

    # The graph stops after 'examiner'. The last state should contain the question in history.
    # history: [ {role: ai, content: Question} ]
    
    # Extract the last message (the question)
    # Note: 'event' in stream_mode="values" is the state dict
    history = last_state.get("history", [])
    question = history[-1]["content"] if history else "Ready?"

    return {
        "session_id": session_id,
        "current_question": question,
        "status": "in_progress"
    }

@app.post("/api/answer")
async def submit_answer(request: AnswerRequest):
    session_id = request.session_id
    thread = {"configurable": {"thread_id": session_id}}
    
    # 1. Get current state (should be paused before 'speech_analysis')
    current_state = app_graph.get_state(thread)
    if not current_state:
         raise HTTPException(status_code=404, detail="Session not found")
         
    # 2. Append user answer to history
    # The state has the history up to the examiner's question.
    history = current_state.values.get("history", [])
    current_question_id = current_state.values.get("current_question_id")
    
    # Persist Answer
    answer_id = None
    try:
        ans_data = {
            "question_id": current_question_id,
            "transcript": request.transcript,
            # "audio_url": ... # If we uploaded it
        }
        # If question_id is missing (e.g. restart/error), we might skip or insert validly if schema allows (it doesn't usually)
        if current_question_id:
            res = supabase.table("answers").insert(ans_data).execute()
            if res.data:
                answer_id = res.data[0]["id"]
    except Exception as e:
        print(f"Error saving answer: {e}")

    history.append({"role": "human", "content": request.transcript})
    
    # 3. Update state with the new history AND answer_id
    app_graph.update_state(thread, {
        "history": history, 
        "current_answer_id": answer_id
    })
    
    # 4. Resume graph execution
    # streaming None triggers the next node (speech_analysis) with the updated state
    events = app_graph.stream(None, thread, stream_mode="values")
    
    last_state = None
    final_feedback = None
    
    for event in events:
        last_state = event
        if "feedback_summary" in event and event["feedback_summary"]:
            final_feedback = event["feedback_summary"]
            
    if not last_state:
         raise HTTPException(status_code=500, detail="Graph processing failed")
            
    # Check if interview complete
    if last_state.get("interview_complete"):
        return {
            "status": "completed",
            "feedback": final_feedback
        }
        
    # Else return next question
    # The graph loops back to Examiner -> Speech Analysis (paused)
    # So the last state should have the NEW question from Examiner
    history = last_state.get("history", [])
    
    # Find the last AI message
    question = "..."
    if history and history[-1]["role"] == "ai":
        question = history[-1]["content"]
    
    return {
        "status": "in_progress",
        "current_question": question
    }

@app.get("/")
def root():
    return {
        "message": "VivaGraph AI Backend API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "start_session": "/api/start",
            "submit_answer": "/api/answer",
            "end_interview": "/api/end",
            "transcribe": "/api/transcribe",
            "speak": "/api/speak"
        }
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """
    Endpoint to transcribe audio file.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    transcript = transcribe_audio(file)
    if not transcript:
        raise HTTPException(status_code=500, detail="Transcription failed")
        
    return {"transcript": transcript}

from fastapi.responses import FileResponse
from .tts import generate_speech_file

class SpeakRequest(BaseModel):
    text: str
    strictness: str

@app.post("/api/speak")
async def speak(request: SpeakRequest):
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="No text provided")
            
        file_path = await generate_speech_file(request.text, request.strictness)
        return FileResponse(file_path, media_type="audio/mpeg", filename="speech.mp3")
    except Exception as e:
        print(f"TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

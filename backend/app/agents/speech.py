from ..models import AgentState

def speech_analysis_agent(state: AgentState):
    """
    Analyzes the transcript for confidence signals using timestamps and filler words.
    """
    history = state.history
    if not history or history[-1]["role"] != "human":
        return {}

    # The content is now expected to be a dict from STT, or a string string if it entered via text fallback
    # But since we updated STT to return a dict, we need to handle both cases or ensure standardization.
    # For now, let's assume the graph state might hold the raw STT result or just text.
    # NOTE: The main.py injects "content" as a string usually. We need to check if we can pass metadata.
    # If the history content is just string, we can only check filler words.
    # Ideally, we should have passed the full STT object in the state. 
    # Let's assume for now we only have text, but we'll try to extract more if possible.
    
    # Wait, in main.py we do: history.append({"role": "human", "content": request.transcript})
    # If request.transcript is the JSON dict from STT (stringified) or just text? 
    # The current Architecture passes text. 
    # To fix this properly without breaking the API contract too much:
    # We will assume 'content' might be a JSON string of the full STT result IF it came from voice.
    # OR we just do text analysis if we can't get timestamps.
    
    # Let's stick to text-based analysis for safety, but enhanced.
    # To really use timestamps, we'd need to change the API contract in main.py to pass the full object.
    
    transcript_text = ""
    stt_data = None
    
    import json
    content = history[-1]["content"]
    
    # Try to parse if it's a JSON string containing segments
    try:
        if isinstance(content, str) and "segments" in content:
           stt_data = json.loads(content)
           transcript_text = stt_data.get("text", "")
        else:
           transcript_text = content
    except:
        transcript_text = content
        
    # filler words analysis
    fillers = ["um", "uh", "ah", "like", "you know", "sort of", "kind of"]
    hesitation_count = 0
    words = transcript_text.lower().split()
    for word in words:
        # Simple cleanup
        clean_word = word.strip(".,!?")
        if clean_word in fillers:
            hesitation_count += 1
            
    # Pause analysis (if we had timestamps)
    pause_duration_ms = 0
    if stt_data and "segments" in stt_data:
        segments = stt_data["segments"]
        for i in range(len(segments) - 1):
            end_prev = segments[i]["end"]
            start_next = segments[i+1]["start"]
            gap = start_next - end_prev
            if gap > 0.5: # 500ms pause
                pause_duration_ms += (gap * 1000)
    
    # Analyze word count / duration (speed)
    # Mocking duration if unavailable
    duration = stt_data.get("duration", len(words) * 0.5) if stt_data else len(words) * 0.5
    wpm = (len(words) / duration) * 60 if duration > 0 else 0
    
    confidence = "High"
    metrics = {
        "hesitation_count": hesitation_count,
        "pause_duration_ms": int(pause_duration_ms),
        "wpm": int(wpm)
    }
    
    # Confidence Logic
    # Low if many hesitations OR very slow speech OR long pauses
    if hesitation_count > 4 or (pause_duration_ms > 3000):
        confidence = "Low"
    elif hesitation_count > 2 or (pause_duration_ms > 1000):
        confidence = "Medium"
        
    metrics["confidence"] = confidence
    
    # Persist Confidence Metrics
    if state.current_answer_id:
        try:
            from ..db import supabase
            conf_data = {
                "answer_id": state.current_answer_id,
                "hesitation_count": hesitation_count,
                "pause_duration_ms": int(pause_duration_ms),
                "confidence_level": confidence,
                "filler_word_count": hesitation_count # Assuming same for now
            }
            supabase.table("confidence_metrics").insert(conf_data).execute()
        except Exception as e:
            print(f"Error saving updated confidence metrics: {e}")
        
    return {"confidence_metrics": metrics}

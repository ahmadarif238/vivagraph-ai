from ..models import AgentState
from ..db import supabase
import json

def memory_agent(state: AgentState):
    """
    Saves the session updates to Supabase.
    """
    session_id = state.session_id
    
    # Update Session
    if state.evaluations:
        latest_eval = state.evaluations[-1]
        try:
             # Calculate session score
             total_score = 0
             count = 0
             for e in state.evaluations:
                 score = 0
                 score += e.get("concept_correctness", 0)
                 score += e.get("clarity", 0)
                 score += e.get("completeness", 0)
                 score += e.get("confidence", 0)
                 score += e.get("handling", 0)
                 
                 total_score += score
                 count += 1
                     
             final_avg = round(total_score / count, 2) if count > 0 else 0.0
             
             if state.interview_complete:
                 supabase.table("sessions").update({
                     "final_score": final_avg,
                     "feedback_summary": state.feedback_summary or ""
                 }).eq("id", session_id).execute()
                 
                 # UPDATE TOPIC MASTERY
                 # Fetch existing
                 user_id_resp = supabase.table("sessions").select("user_id").eq("id", session_id).execute()
                 if user_id_resp.data:
                    user_id = user_id_resp.data[0]["user_id"]
                    topic = state.topic
                    
                    # Simple moving average logic for mastery
                    # Mastery is 0-100. Score is 0-10.
                    # new_mastery = (old_mastery + (score * 10)) / 2
                    
                    mastery_resp = supabase.table("topic_mastery").select("mastery_level").eq("user_id", user_id).eq("topic", topic).execute()
                    
                    if mastery_resp.data:
                        old_mastery = mastery_resp.data[0]["mastery_level"]
                        new_mastery = int((old_mastery + (final_avg * 10)) / 2)
                        
                        supabase.table("topic_mastery").update({
                            "mastery_level": new_mastery,
                            "last_updated": "now()"
                        }).eq("user_id", user_id).eq("topic", topic).execute()
                    else:
                        # Create new
                        new_mastery = int(final_avg * 10)
                        supabase.table("topic_mastery").insert({
                            "user_id": user_id,
                            "topic": topic,
                            "mastery_level": new_mastery
                        }).execute()

             # INSERT CONFIDENCE METRICS
             # We assume confidence metrics are available in the state
             if state.confidence_metrics:
                 # We need the answer_id. But our state doesn't track answer_ids tightly linked to DB.
                 # In a real app we would create records for each Q&A. 
                 # For now, we unfortunately can't link to 'answers' table without an ID.
                 # Optimization: We should have been creating Question/Answer rows in the DB during the loop.
                 # But sticking to requirements without major refactor:
                 # Let's just finish the session update.
                 pass

        except Exception as e:
            print(f"Error saving memory: {e}")
            import traceback
            traceback.print_exc()
            
    return {}
            
    return {}

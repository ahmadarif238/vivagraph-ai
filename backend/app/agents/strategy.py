from langchain_core.prompts import ChatPromptTemplate
from langchain_cerebras import ChatCerebras
from ..models import AgentState
from ..prompts import STRATEGY_PROMPT
import os

llm = ChatCerebras(api_key=os.getenv("CEREBRAS_API_KEY"), model="llama-3.3-70b") # Using 70B for reasoning

def strategy_agent(state: AgentState):
    """
    Decides the next action.
    """
    history = state.history
    scores = state.evaluations
    topic = state.topic
    strictness = state.strictness_level
    
    # Respect manual stop
    if state.interview_complete:
         return {"interview_complete": True}
    
    # Simple logic check before calling LLM to save tokens if obvious
    # SAFETY / LENGTH CHECKS (Run these first)
    
    # 1. Standard Viva Limit
    if state.mode == "viva" and len(history) >= 10: 
        return {"interview_complete": True}

    # 2. Presentation Mode - Total Limit (Safety)
    if len(history) >= 20:
        return {"interview_complete": True}
        
    # 3. Presentation Mode - Q&A Limit
    if state.mode == "presentation" and state.presentation_stage == "qa":
        if len(history) >= 16:
             return {"interview_complete": True}

    # PRESENTATION MODE LOGIC
    if state.mode == "presentation" and state.presentation_stage == "speaking":
        # Check if user indicates they are done
        # Guard against empty history (start of session)
        if not history:
             return {
                "interview_complete": False,
                "presentation_stage": "speaking"
            }
            
        # Force transition if speech is too long (e.g. > 8 turns of just speaking)
        # 8 turns = 16 items in history. But history includes the Q&A setup?
        # Let's just say if history > 12 while speaking, move to QA.
        if len(history) >= 12:
             return {
                "interview_complete": False,
                "presentation_stage": "qa",
                "interview_stage": "depth"
            }
            
        last_user_msg = history[-1]["content"].lower()
        done_signals = ["that is all", "i am done", "i have finished", "concludes my presentation", "thank you"]
        
        is_done = any(signal in last_user_msg for signal in done_signals)
        
        if is_done:
            # Switch to Q&A
            return {
                "interview_complete": False,
                "presentation_stage": "qa",
                "interview_stage": "depth" # Jump to depth for Q&A on the presentation
            }
        else:
            # Continue speaking
            return {
                "interview_complete": False,
                "presentation_stage": "speaking"
            }

    prompt = ChatPromptTemplate.from_template(STRATEGY_PROMPT)
    chain = prompt | llm
    
    # Calculate number of questions asked
    num_questions = len(history) // 2

    response = chain.invoke({
        "history": str(history[-2:]) if history else "Start",
        "num_questions": num_questions,
        "scores": str(scores[-1]) if scores else "None",
        "topic": topic,
        "strictness": strictness
    })
    
    decision = response.content.strip().lower()
    
    if "end_interview" in decision:
        return {"interview_complete": True}
    
    # Check Stage Transition
    # Simple logic: 2 turns -> foundation, 4 turns -> depth
    # length of history: 2 (1 Q, 1 A) = 1 turn
    turns = len(history) // 2
    
    current_stage = state.interview_stage
    next_stage = current_stage
    
    if turns >= 1 and current_stage == "intro":
        next_stage = "foundation"
    elif turns >= 3 and current_stage == "foundation":
        next_stage = "depth"
        
    return {
        "interview_complete": False, 
        "interview_stage": next_stage
    }

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from ..models import AgentState
from ..prompts import (
    EXAMINER_PERSONA_EASY, 
    EXAMINER_PERSONA_MODERATE, 
    EXAMINER_PERSONA_STRICT, 
    EXAMINER_PROMPT,
    EXAMINER_PERSONA_LISTENER
)
from ..rag import retrieve_context
import os

# Initialize LLM
# Migrated off Cerebras (2026-08): the Cerebras free tier now returns
# `payment_required`, and the "llama-3.3-70b"/"llama3.1-8b" ids are gone
# from both providers. Groq free tier still works; gpt-oss is a reasoning
# model, so hide the chain of thought - callers json.loads() `.content`.
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model=os.getenv("GROQ_FAST_MODEL", "openai/gpt-oss-20b"),  # fast: question generation
    reasoning_format="hidden",
    reasoning_effort="low",
)

def get_persona_instructions(strictness: str):
    if strictness.lower() == "easy":
        return EXAMINER_PERSONA_EASY
    elif strictness.lower() == "strict":
        return EXAMINER_PERSONA_STRICT
    else:
        return EXAMINER_PERSONA_MODERATE

def examiner_agent(state: AgentState):
    """
    Generates the next question.
    """
    topic = state.topic
    strictness = state.strictness_level
    history = state.history
    
    # Retrieve context based on topic and recent history to ground the question
    query = f"{topic}"
    if history:
         # Include the last answer to find relevant follow-up context
         query += f" {history[-1]['content']}"
    
    print(f"[EXAMINER] Generating question for topic: '{topic}'")
    print(f"[EXAMINER] Using RAG query: '{query}'")
    
    docs = retrieve_context(query, k=5, session_id=state.session_id)
    context = "\n\n".join([doc.page_content for doc in docs]) if docs else "General Knowledge"

    persona = get_persona_instructions(strictness)
    
    # Presentation Mode Override
    if state.mode == "presentation" and state.presentation_stage == "speaking":
        persona = EXAMINER_PERSONA_LISTENER
    
    prompt = ChatPromptTemplate.from_template(EXAMINER_PROMPT)
    chain = prompt | llm
    
    response = chain.invoke({
        "context": context,
        "topic": topic,
        "strictness": strictness,
        "history": history,
        "persona_instructions": persona,
        "mastery": state.topic_mastery,
        "stage": state.interview_stage
    })
    
    question_text = response.content
    
    # Persist Question to DB
    try:
        from ..db import supabase
        q_data = {
            "session_id": state.session_id,
            "question_text": question_text,
            "question_order": state.current_question_index + 1,
            "concept_focus": topic # Can be refined later
        }
        res = supabase.table("questions").insert(q_data).execute()
        # AgentState types this as Optional[str], but the DB assigns an integer
        # primary key - passing it through raw fails pydantic validation and
        # aborts the whole graph run. Coerce so either id style works.
        raw_id = res.data[0]["id"] if res.data else None
        question_id = str(raw_id) if raw_id is not None else None
    except Exception as e:
        print(f"Error saving question: {e}")
        question_id = None
    
    return {
        "history": [{"role": "ai", "content": question_text}],
        "current_question_index": state.current_question_index + 1,
        "current_question_id": question_id
    }

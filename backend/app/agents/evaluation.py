from langchain_core.prompts import ChatPromptTemplate
from langchain_cerebras import ChatCerebras
from ..models import AgentState
from ..prompts import EVALUATION_PROMPT
from ..rag import retrieve_context
import os
import json

llm = ChatCerebras(api_key=os.getenv("CEREBRAS_API_KEY"), model="llama-3.3-70b")

def evaluation_agent(state: AgentState):
    """
    Evaluates the last answer.
    """
    history = state.history
    # Assuming history order is: [AI Question, Human Answer, ...]
    if len(history) < 2 or history[-1]["role"] != "human":
        return {} # Nothing to evaluate

    question = history[-2]["content"]
    answer = history[-1]["content"]
    
    # Context retrieval
    # Construct a query from the question and answer to find relevant knowledge
    retrieval_query = f"{question}\n{answer}"
    docs = retrieve_context(retrieval_query, session_id=state.session_id)
    context = "\n\n".join([doc.page_content for doc in docs]) if docs else "No specific context retrieved." 

    prompt = ChatPromptTemplate.from_template(EVALUATION_PROMPT)
    chain = prompt | llm
    
    response = chain.invoke({
        "context": context,
        "question": question,
        "answer": answer
    })
    
    try:
        analysis = json.loads(response.content)
    except:
        analysis = {"feedback": "Error parsing evaluation."}

    # Persist Evaluation
    if state.current_answer_id:
        try:
            from ..db import supabase
            eval_data = {
                "answer_id": state.current_answer_id,
                # "score": 0, # Not in schema, removing placeholder
                "feedback_text": analysis.get("feedback", ""),
                "concept_correctness_score": analysis.get("concept_correctness", 0),
                "clarity_score": analysis.get("clarity", 0),
                "completeness_score": analysis.get("completeness", 0),
                "confidence_score_eval": analysis.get("confidence", 0), 
                "follow_up_handling_score": analysis.get("handling", 0)
            }
            supabase.table("evaluations").insert(eval_data).execute()
        except Exception as e:
            print(f"Error saving evaluation: {e}")

    # Append to state evaluations if needed or just return last
    # The graph usually merges, but let's be safe and just return the new list item
    return {"evaluations": [analysis]}

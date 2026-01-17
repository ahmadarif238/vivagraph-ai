from langchain_core.prompts import ChatPromptTemplate
from langchain_cerebras import ChatCerebras
from ..models import AgentState
import os

llm = ChatCerebras(api_key=os.getenv("CEREBRAS_API_KEY"), model="llama-3.3-70b")

FEEDBACK_PROMPT = """Generate detailed feedback for the student based on the viva performance.
Topic: {topic}
Scores: {scores}
Transcript History: {history}

Analyze the session and provide a structured JSON output with the following schema:
{{
  "overall_score": <int 0-10>,
  "summary": "<string> A brief 2-3 sentence executive summary of performance.",
  "strengths": ["<string>", "<string>", ...],
  "weaknesses": ["<string>", "<string>", ...],
  "improvement_tips": ["<string>", "<string>", ...],
  "resources": [
      {{ "title": "<string>", "type": "Course/Book/Article", "link": "<string>" }}
  ]
}}

Ensure the JSON is valid and strictly follows the schema. Do not include markdown formatting (like ```json) in the response, just the raw JSON.
"""

def feedback_agent(state: AgentState):
    """
    Generates final feedback.
    """
    # Check if interview is complete
    if not state.interview_complete:
        return {}

    prompt = ChatPromptTemplate.from_template(FEEDBACK_PROMPT)
    chain = prompt | llm
    
    response = chain.invoke({
        "topic": state.topic,
        "scores": str(state.evaluations),
        "history": str(state.history)
    })
    
    return {"feedback_summary": response.content}

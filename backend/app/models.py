from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

# User Models
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Session Models
class SessionCreate(BaseModel):
    user_id: uuid.UUID
    topic: str
    strictness_level: str

class Session(SessionCreate):
    id: uuid.UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    final_score: Optional[float] = None
    feedback_summary: Optional[str] = None

    class Config:
        from_attributes = True

# Question Models
class QuestionBase(BaseModel):
    session_id: uuid.UUID
    question_text: str
    question_order: int
    concept_focus: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Answer Models
class AnswerCreate(BaseModel):
    question_id: uuid.UUID
    transcript: str
    audio_url: Optional[str] = None

class Answer(AnswerCreate):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Evaluation Models
class EvaluationCreate(BaseModel):
    answer_id: uuid.UUID
    concept_correctness_score: int
    clarity_score: int
    completeness_score: int
    confidence_score_eval: int
    follow_up_handling_score: int
    feedback_text: str
    improved_answer_example: Optional[str] = None

class Evaluation(EvaluationCreate):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Agent Inputs/Outputs (LangGraph)
class AgentState(BaseModel):
    session_id: Optional[str] = None
    topic: Optional[str] = "General"
    strictness_level: Optional[str] = "Moderate"
    current_question_index: int = 0
    history: List[dict] = [] # List of {"role": "human"|"ai", "content": "..."}
    evaluations: List[dict] = []
    
    # Flags
    interview_complete: bool = False
    
    # Context
    topic_mastery: int = 0 # 0-100
    confidence_metrics: Optional[dict] = None # Latest confidence metrics
    interview_stage: str = "intro" # intro, foundation, depth

    # DB Tracking
    current_question_id: Optional[str] = None
    current_answer_id: Optional[str] = None

    # Modes
    mode: str = "viva" # viva, presentation
    presentation_stage: str = "speaking" # speaking, qa (only used in presentation mode)
    feedback_summary: Optional[str] = None

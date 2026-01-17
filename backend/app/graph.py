from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from .models import AgentState
from .agents.examiner import examiner_agent
from .agents.strategy import strategy_agent
from .agents.evaluation import evaluation_agent
from .agents.speech import speech_analysis_agent
from .agents.feedback import feedback_agent
from .agents.memory import memory_agent

# Define the graph
workflow = StateGraph(AgentState)

# Nodes
workflow.add_node("strategy", strategy_agent)
workflow.add_node("examiner", examiner_agent)
workflow.add_node("evaluation", evaluation_agent)
workflow.add_node("speech_analysis", speech_analysis_agent)
workflow.add_node("feedback", feedback_agent)
workflow.add_node("memory", memory_agent)

# Entry Point
workflow.set_entry_point("strategy")

# Conditional Logic
def decide_next_step(state: AgentState):
    if state.interview_complete:
        return "feedback"
    return "examiner"

workflow.add_conditional_edges(
    "strategy",
    decide_next_step,
    {
        "feedback": "feedback",
        "examiner": "examiner"
    }
)

# Flow
# Strategy -> Examiner -> Speech Analysis (Interrupt before this to get user input) -> Evaluation -> Strategy

workflow.add_edge("examiner", "speech_analysis")
workflow.add_edge("speech_analysis", "evaluation")
workflow.add_edge("evaluation", "strategy")

# End Flow
workflow.add_edge("feedback", "memory")
workflow.add_edge("memory", END)

# Checkpointer for state persistence
checkpointer = MemorySaver()

# Compile
# Interrupt before speech_analysis so we can inject the human answer into the state
app_graph = workflow.compile(checkpointer=checkpointer, interrupt_before=["speech_analysis"])

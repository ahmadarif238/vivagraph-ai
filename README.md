<div align="center">

![VivaGraph Logo](file:///C:/Users/Hamza%20Computer/.gemini/antigravity/brain/a6fac593-44d9-49c9-b2da-b01d09ebb57c/vivagraph_logo_1768653480825.png)

# VivaGraph AI
### Master Your Oral Exams & Presentations.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_Flows-FF9900.svg?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![FastAPI](https://img.shields.io/badge/FastAPI-High_Performance-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Interactive_UI-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Cerebras](https://img.shields.io/badge/Cerebras-Wafer_Scale-8000FF.svg?style=for-the-badge)](https://cerebras.net/)
[![Groq](https://img.shields.io/badge/Groq-Realtime_Voice-F05032.svg?style=for-the-badge)](https://groq.com/)

<br/>

**The ultimate practice tool for students. Upload your notes, give a presentation, or sit for a viva, and let the AI examiner test your knowledge.**

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🎯 What is VivaGraph AI?

**VivaGraph AI** is a platform designed to help you prepare for the psychological pressure of real-world oral examinations and presentations. 

Most students fail not because they don't know the material, but because they panic under questioning. This tool gives you a safe, realistic environment to practice.

### How it works:
1.  **Upload Knowledge**: Upload your PDF notes, huge research papers, or thesis.
2.  **Choose Your Mode**:
    *   **🎤 Presentation Mode**: You present your topic, and the AI listens. When you're done, it grills you with questions based on what you *didn't* cover.
    *   **👨‍🏫 Viva Mode**: A strict, back-and-forth oral exam where the AI tests the depth of your understanding.
3.  **Get Graded**: Receive a detailed confidence report, checking not just your facts, but your hesitation, clarity, and "umms/ahhs".

---

## ⚡ The problem with current AI
ChatGPT is too nice. It praises everything you say.
**Real examiners are not nice.** They interrupt. They doubt you. They ask "Are you sure?" just to see if you crumble.

**VivaGraph AI is built to simulate this reality.**
It is an advanced multi-agent system that can switch personas—from a helpful coach to a strict professor—to ensure you are ready for the real thing.

---

## 🤖 System Architecture

I didn't just wrap a chatbot. I built a **Cognitive Core**—a team of 7 specialized AI Agents working together to act like a human examiner.

```mermaid
graph TD
    User((You)) <--> |"Speaking..."| STT[Speech-to-Text (Ear)]
    STT --> |"Transcript"| Strategy[🧠 Chief Examiner Agent]
    
    subgraph " The Agent Swarm"
        Strategy --> |"Fact Check"| RAG[📚 Researcher Agent]
        RAG --> |"Set Tone"| Examiner[🎓 Personality Agent]
        Examiner --> |"Speak"| TTS[Text-to-Speech (Mouth)]
    end
    
    subgraph "Real-time Analysis"
        STT --> |"Did you stutter?"| Analyst[📊 Psychology Agent]
        Analyst --> |"Update Score"| Memory[💾 Session Database]
    end
    
    Strategy --> |"Session Over"| Coach[💡 Teacher Agent]
    Coach --> Report[📄 Final Report Card]
```

---

## 🦾 Key Features

### 1. "Strict Mode" (The Stress Test)
*   **Dynamic Difficulty**: If you answer too easily, the AI gets harder. If you hesitate, it presses you.
*   **No Hallucinations**: It *only* asks questions from the files you uploaded. It won't make things up.

### 2. Voice Analysis
*   It counts your **filler words** ("um," "like," "uh").
*   It measures how long you take to answer (**Latency**).
*   It detects when you are sounding uncertain.

### 3. Production-Grade Tech
For the technical recruiters watching: This isn't a toy. It's built with the fastest AI hardware available:
*   **Groq LPU**: For instant, human-speed voice responses (<500ms).
*   **Cerebras**: Wafer-scale computing for complex reasoning.
*   **LangGraph**: Cyclic state management for complex agent behaviors.

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### Quick Install

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/yourusername/vivagraph-ai.git
    cd vivagraph-ai
    ```

2.  **Start Backend**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

3.  **Start Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Practice!**
    Open `http://localhost:5173` and start talking.

---

<div align="center">

**[Star this Repo 🌟](#)** if you want to ace your next interview!

<i>Built by [Arif Ahmad Khan]</i>

</div>

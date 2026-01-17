-- AI Viva and Coaching Agent Schema

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    end_time TIMESTAMP WITH TIME ZONE,
    topic TEXT NOT NULL,
    strictness_level TEXT NOT NULL, -- 'Easy', 'Moderate', 'Strict'
    final_score NUMERIC(4, 2), -- Score out of 10
    feedback_summary TEXT
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    concept_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id),
    transcript TEXT,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID REFERENCES answers(id),
    concept_correctness_score INTEGER, -- Out of 4
    clarity_score INTEGER, -- Out of 2
    completeness_score INTEGER, -- Out of 2
    confidence_score_eval INTEGER, -- Out of 1
    follow_up_handling_score INTEGER, -- Out of 1
    feedback_text TEXT,
    improved_answer_example TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS confidence_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID REFERENCES answers(id),
    hesitation_count INTEGER DEFAULT 0,
    filler_word_count INTEGER DEFAULT 0,
    pause_duration_ms INTEGER DEFAULT 0,
    confidence_level TEXT -- 'High', 'Medium', 'Low'
);

CREATE TABLE IF NOT EXISTS topic_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    topic TEXT NOT NULL,
    mastery_level INTEGER DEFAULT 0, -- 0-100 scale
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, topic)
);

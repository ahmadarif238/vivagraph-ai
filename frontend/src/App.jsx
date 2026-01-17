import React, { useState } from 'react';
import TopicSelection from './components/TopicSelection';
import VivaInterface from './components/VivaInterface';
import FeedbackDisplay from './components/FeedbackDisplay';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [sessionData, setSessionData] = useState(null);
  const [interviewState, setInterviewState] = useState('selection'); // selection, interview, feedback
  const [finalFeedback, setFinalFeedback] = useState(null);

  const handleStartSession = (data) => {
    setSessionData(data);
    setInterviewState('interview');
  };

  const handleComplete = (feedback) => {
    setFinalFeedback(feedback);
    setInterviewState('feedback');
  };

  const handleBackToSelection = () => {
    setInterviewState('selection');
    setSessionData(null);
    setFinalFeedback(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-700/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-700/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-4xl z-10">
        <header className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          >
            <span className="text-gradient">AI Viva & Coaching</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Master your concepts with personalized AI evaluations
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {interviewState === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TopicSelection onStart={handleStartSession} />
            </motion.div>
          )}

          {interviewState === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VivaInterface
                sessionData={sessionData}
                onComplete={handleComplete}
                onBack={handleBackToSelection}
              />
            </motion.div>
          )}

          {interviewState === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FeedbackDisplay
                feedback={finalFeedback}
                onHome={handleBackToSelection}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

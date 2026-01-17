import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { BookOpen, User, Mail, Sparkles, AlertCircle, Loader2, Upload, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const TopicSelection = ({ onStart, onShowProgress }) => {
    const [topic, setTopic] = useState('');
    const [strictness, setStrictness] = useState('Moderate');
    const [mode, setMode] = useState('viva');
    // Auto-generate or retrieve guest email
    const [email, setEmail] = useState(() => {
        const saved = localStorage.getItem('viva_user_email');
        if (saved) return saved;
        const newEmail = `guest_${Math.floor(Math.random() * 10000)}@viva.ai`;
        localStorage.setItem('viva_user_email', newEmail);
        return newEmail;
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('topic', topic);
            formData.append('strictness', strictness);
            formData.append('user_email', email);
            formData.append('mode', mode);
            if (file) {
                formData.append('file', file);
            }

            const response = await axios.post(`${API_BASE_URL}/api/start`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onStart({
                session_id: response.data.session_id,
                initial_question: response.data.current_question,
                topic,
                strictness,
                mode
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to start session. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">Start Your Viva</h2>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200"
                >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </motion.div>
            )}

            <form onSubmit={handleStart} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Topic or Subject</label>
                    <div className="relative group">
                        <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            className="glass-input w-full pl-12"
                            placeholder="e.g. Artificial Intelligence, Roman History..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Mode Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70 ml-1">Practice Mode</label>
                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 relative">
                        {/* Slider Background */}
                        <motion.div
                            className="absolute top-1 bottom-1 bg-cyan-500/20 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                            initial={false}
                            animate={{
                                x: mode === 'viva' ? 0 : '100%',
                                width: '50%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            type="button"
                            onClick={() => setMode('viva')}
                            className={`flex-1 relative z-10 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${mode === 'viva' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
                        >
                            Viva Inspection
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('presentation')}
                            className={`flex-1 relative z-10 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${mode === 'presentation' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
                        >
                            Presentation Mode
                        </button>
                    </div>
                    <p className="text-xs text-white/40 ml-1">
                        {mode === 'viva'
                            ? "Standard Q&A format where the examiner asks questions."
                            : "Deliver your speech uninterrupted. The examiner listens then asks Q&A."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Strictness Level</label>
                        <div className="relative">
                            <select
                                className="glass-input w-full appearance-none cursor-pointer"
                                value={strictness}
                                onChange={(e) => setStrictness(e.target.value)}
                            >
                                <option className="bg-gray-900 text-white" value="Easy">Easy (Supportive)</option>
                                <option className="bg-gray-900 text-white" value="Moderate">Moderate (Standard)</option>
                                <option className="bg-gray-900 text-white" value="Strict">Strict (Challenging)</option>
                            </select>
                        </div>
                    </div>

                    {/* Email Input - Restored for Progress Tracking */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Your Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                className="glass-input w-full pl-12"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    localStorage.setItem('viva_user_email', e.target.value);
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Upload Material (Optional)</label>
                        <div className="relative group">
                            <Upload className="absolute left-4 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="file"
                                accept=".pdf,.txt"
                                className="glass-input w-full pl-12 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <p className="text-xs text-white/40 ml-1">Support for PDF or Text files to ground the interview context.</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full glass-button bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30 text-cyan-100 py-4 mt-4 flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Configuring Examiner...</span>
                        </>
                    ) : (
                        <>
                            <span>Begin Interview</span>
                            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </motion.button>

                <button
                    type="button"
                    onClick={() => {
                        console.log("Progress button clicked"); // Debug
                        if (onShowProgress) onShowProgress();
                        else console.error("onShowProgress prop missing");
                    }}
                    className="w-full mt-2 text-sm text-cyan-400/60 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 py-2"
                >
                    <TrendingUp className="w-4 h-4" />
                    View My Progress
                </button>
            </form >
        </div >
    );
};

export default TopicSelection;

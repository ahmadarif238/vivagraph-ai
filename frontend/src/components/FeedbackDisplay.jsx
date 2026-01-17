import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Award, RefreshCcw, BookOpen, CheckCircle, AlertTriangle, TrendingUp, Link as LinkIcon, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackDisplay = ({ feedback, onHome }) => {
    let data = null;
    let isLegacy = false;

    // Try parsing JSON, fallback to markdown
    try {
        // Clean potential markdown code blocks if the LLM adds them
        const cleanJson = feedback.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanJson);
    } catch (e) {
        console.warn("Could not parse feedback as JSON, falling back to Markdown display.", e);
        isLegacy = true;
    }

    if (isLegacy) {
        return (
            <div className="glass-card p-8 md:p-10 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Viva Completed!</h2>
                    <p className="text-white/60">Legacy Report Format</p>
                </div>
                <div className="glass-card bg-black/20 p-6 md:p-8 prose prose-invert max-w-none prose-headings:text-cyan-400">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
                <div className="flex justify-center pt-8">
                    <button onClick={onHome} className="glass-button px-8 py-3 flex items-center gap-2">
                        <RefreshCcw className="w-5 h-5" />
                        <span>Start New Session</span>
                    </button>
                </div>
            </div>
        );
    }

    // New Structured UI
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header & Score */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 ${data.overall_score >= 7 ? 'border-green-400 text-green-400' : 'border-orange-400 text-orange-400'} bg-black/40 text-4xl font-bold shadow-2xl`}>
                        {data.overall_score}<span className="text-lg text-white/40 font-normal">/10</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white">Evaluation Report</h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto mt-2 leading-relaxed">{data.summary}</p>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Strengths */}
                <motion.div variants={itemVariants} className="glass-card p-6 border-t-4 border-t-green-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Key Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.strengths.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Weaknesses */}
                <motion.div variants={itemVariants} className="glass-card p-6 border-t-4 border-t-red-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.weaknesses.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Improvement Tips - Full Width */}
                <motion.div variants={itemVariants} className="glass-card p-6 md:col-span-2 border-t-4 border-t-blue-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Action Plan</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.improvement_tips.map((tip, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-4xl font-bold text-white/10 mb-2 block">{i + 1}</span>
                                <p className="text-white/90">{tip}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Resources */}
                <motion.div variants={itemVariants} className="glass-card p-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Recommended Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.resources.map((res, i) => (
                            <a
                                key={i}
                                href={res.link !== "#" ? res.link : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group cursor-pointer"
                            >
                                <div className="h-10 w-10 rounded-lg bg-black/30 flex items-center justify-center text-white/40 group-hover:text-purple-400 transition-colors">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors">{res.title}</h4>
                                    <span className="text-xs text-white/40 uppercase tracking-wider">{res.type}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </motion.div>

            </motion.div>

            <div className="flex justify-center pt-6 gap-4">
                <button
                    onClick={() => window.print()}
                    className="glass-button px-6 py-3 flex items-center gap-2 hover:bg-white/10"
                >
                    <Download className="w-5 h-5" />
                    <span>Save Report</span>
                </button>
                <button
                    onClick={onHome}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    <RefreshCcw className="w-5 h-5" />
                    <span>Start New Session</span>
                </button>
            </div>
        </div>
    );
};

export default FeedbackDisplay;

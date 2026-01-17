import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { ArrowLeft, Award, Calendar, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressDashboard = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ history: [], mastery: [] });
    const [error, setError] = useState('');

    // Retrieve email from local storage (auto-guest)
    const email = localStorage.getItem('viva_user_email');

    useEffect(() => {
        const fetchData = async () => {
            if (!email) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/progress?email=${email}`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching progress:", err);
                setError("Failed to load progress data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [email]);

    return (
        <div className="glass-card p-6 md:p-8 w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    My Progress
                </h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Mastery Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-400" />
                            Skill Mastery
                        </h3>
                        {data.mastery.length === 0 ? (
                            <p className="text-white/40 italic">No skills recorded yet. Complete a session!</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.mastery.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-medium">{item.topic}</span>
                                            <span className="text-cyan-400 font-bold">{item.mastery_level}%</span>
                                        </div>
                                        <div className="w-full bg-black/30 rounded-full h-2">
                                            <div
                                                className="bg-cyan-500 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${item.mastery_level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* History Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            Recent Sessions
                        </h3>
                        {data.history.length === 0 ? (
                            <p className="text-white/40 italic">No sessions found.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {data.history.map((session) => (
                                    <div key={session.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors">
                                        <div>
                                            <h4 className="text-white font-medium">{session.topic}</h4>
                                            <p className="text-xs text-white/40">
                                                {new Date(session.start_time).toLocaleDateString()} • {session.strictness_level} Mode
                                            </p>
                                        </div>
                                        {/* Placeholder for future score/feedback summary if available in session record */}
                                        <div className="text-right">
                                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default ProgressDashboard;

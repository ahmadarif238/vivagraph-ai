import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Mic, Square, Send, Volume2, AlertCircle, Loader2, RefreshCcw, XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AudioStreamer } from '../utils/AudioStreamer';

const VivaInterface = ({ sessionData, onComplete, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(sessionData?.initial_question || 'Ready?');
    // ... (Keep existing states)
    const [isRealTime, setIsRealTime] = useState(false); // New Mode
    const [rtStatus, setRtStatus] = useState('idle'); // idle, listening, processing, speaking
    const streamerRef = useRef(null);

    // Existing States
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [speaking, setSpeaking] = useState(false);

    // TTS Function (Cloud/Edge) - Legacy Mode
    const audioRef = useRef(new Audio());

    const playAudio = async (text, strictness) => {
        // ... (Keep exact existing logic for playAudio)
        try {
            setSpeaking(true);
            audioRef.current.pause();

            const response = await axios.post(`${API_BASE_URL}/api/speak`, {
                text: text,
                strictness: strictness || 'Moderate'
            }, {
                responseType: 'blob'
            });

            const audioUrl = URL.createObjectURL(response.data);
            audioRef.current.src = audioUrl;

            audioRef.current.onended = () => {
                setSpeaking(false);
                URL.revokeObjectURL(audioUrl);
            };

            audioRef.current.onerror = () => {
                setSpeaking(false);
            };

            await audioRef.current.play();
        } catch (err) {
            setSpeaking(false);
            if (err.name === 'NotAllowedError') {
                setError('Autoplay blocked.');
            }
        }
    };

    // ... (Keep existing visualizer logic)
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);

    const startVisualizer = async (streamInput = null) => {
        try {
            let stream = streamInput;
            if (!stream) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyserRef.current = analyser;
            sourceRef.current = source;

            drawVisualizer();
        } catch (err) {
            console.error(err);
        }
    };

    // ... (Keep drawVisualizer)
    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = isRealTime ? '#10b981' : '#06b6d4'; // Green for RT, Cyan for Legacy
            canvasCtx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height / 2) + ((1 - v) * canvas.height / 2 * 0.5);

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        draw();
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (sourceRef.current) {
            // In RT mode, don't stop tracks if owned by Streamer, but here we just disconnect node
            try {
                sourceRef.current.disconnect();
            } catch (e) { }
        }
    };

    // ... (Keep existing Legacy STT effects)
    // State ref to access current value inside event listeners/closures
    const isRecordingRef = useRef(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const [useServerSTT, setUseServerSTT] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Initialize Speech Recognition (Client Side)
    useEffect(() => {
        // ... (Keep existing Logic, BUT check !isRealTime)
        if (isRealTime) return; // Disable legacy logic if RT mode

        // Auto-enable Server STT on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            setUseServerSTT(true);
        }

        let speech = null;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition && !useServerSTT) {
            speech = new SpeechRecognition();
            speech.continuous = true;
            speech.interimResults = true;
            speech.lang = 'en-US';

            speech.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript((prev) => prev + (prev ? ' ' : '') + finalTranscript);
                }
            };

            speech.onerror = (event) => {
                // ... (Keep logic)
                if (event.error === 'no-speech') return;
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
            };

            speech.onend = () => {
                if (isRecordingRef.current && !useServerSTT && !isRealTime) {
                    try { speech.start(); } catch (e) { }
                }
            };

            setRecognition(speech);
        }

        return () => {
            if (speech) speech.stop();
        };
    }, [useServerSTT, isRealTime]);

    // Real-Time Control
    const toggleRealTime = async () => {
        if (isRealTime) {
            // Stop RT
            streamerRef.current?.stopRecording();
            setIsRealTime(false);
            setRtStatus('idle');
            stopVisualizer();
        } else {
            // Start RT
            stopRecording(); // Stop legacy if running
            setIsRealTime(true);
            setRtStatus('connecting');

            const wsUrl = API_BASE_URL.replace('http', 'ws') + `/ws/realtime/${sessionData?.session_id || 'test'}`;
            const streamer = new AudioStreamer(wsUrl, (msg) => {
                processRtMessage(msg);
            });

            await streamer.connect();
            setRtStatus('listening');

            // Wait for socket open (handled inside class, but we need time for mic)
            setTimeout(async () => {
                await streamer.startRecording();
                streamerRef.current = streamer;
                // Hook visualizer to the SAME stream
                if (streamer.stream) {
                    startVisualizer(streamer.stream);
                }
            }, 1000);
        }
    };

    const processRtMessage = (msg) => {
        if (msg.type === 'transcript') {
            setTranscript(msg.text); // Live update
        } else if (msg.type === 'response_text') {
            setCurrentQuestion(msg.text); // Allow reading while hearing
            setTranscript(''); // Clear user input on new question
        } else if (msg.type === 'state') {
            setRtStatus(msg.status);
        } else if (msg.type === 'interrupt') {
            setRtStatus('interrupted');
            setTimeout(() => setRtStatus('listening'), 1000);
        }
    };

    // Cleanup RT on unmount
    useEffect(() => {
        return () => {
            streamerRef.current?.stopRecording();
        };
    }, []);

    // Existing Handlers
    const startRecording = async () => { /* ... Keep existing ... */
        // Force wrap existing logic:
        if (isRealTime) return;

        setTranscript('');
        setError('');
        window.speechSynthesis.cancel();
        setIsRecording(true);
        isRecordingRef.current = true;

        try {
            if (useServerSTT) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                let mimeType = 'audio/webm';
                // ... mimeType logic
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
                audioChunksRef.current = [];
                mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
                mediaRecorderRef.current.start();
                startVisualizer(stream);
            } else {
                recognition?.start();
                startVisualizer();
            }
        } catch (e) { setError("Mic Error"); setIsRecording(false); }
    };

    const stopRecording = async () => {
        if (isRealTime) return;
        setIsRecording(false);
        isRecordingRef.current = false;
        stopVisualizer();

        if (useServerSTT) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                setIsProcessingAudio(true);
                mediaRecorderRef.current.onstop = async () => {
                    // ... upload logic ...
                    const mimeType = mediaRecorderRef.current.mimeType;
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    const formData = new FormData();
                    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                    formData.append("file", audioBlob, `rec.${ext}`);

                    try {
                        const res = await axios.post(`${API_BASE_URL}/api/transcribe`, formData);
                        setTranscript(res.data.transcript);
                    } catch (err) { setError(err.message); }
                    finally { setIsProcessingAudio(false); }
                };
                mediaRecorderRef.current.stop();
            }
        } else {
            recognition?.stop();
        }
    };

    const handleRetake = () => { setTranscript(''); startRecording(); };
    const handleSubmitAnswer = async () => { /* ... Keep Same ... */
        if (!transcript.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/answer`, {
                session_id: sessionData.session_id,
                transcript: transcript
            });
            if (response.data.status === 'completed') onComplete(response.data.feedback);
            else {
                setCurrentQuestion(response.data.current_question);
                setTranscript('');
            }
        } catch (e) { setError("Error submitting"); }
        finally { setLoading(false); }
    };

    const handleEndInterview = async () => { /* ... Keep Same ... */
        if (!window.confirm("End?")) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/api/end`, {
                session_id: sessionData.session_id
            });
            if (response.data.status === 'completed') onComplete(response.data.feedback);
        } catch (e) { }
    };

    const handleBackConfirm = () => { if (confirm("Back?")) onBack(); };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">

            <div className="flex justify-between items-center">
                <button onClick={handleBackConfirm} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <div className="flex gap-2">

                    <button onClick={handleEndInterview} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium">
                        <XCircle className="w-4 h-4" /> <span>End</span>
                    </button>
                </div>
            </div>

            {/* Examiner Card */}
            <motion.div layout className={`glass-card p-8 md:p-10 relative overflow-hidden transition-all ${isRealTime ? 'border-green-500/30 shadow-green-900/20' : ''}`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isRealTime ? 'from-green-400 to-emerald-600' : 'from-cyan-400 to-purple-500'} ${speaking || rtStatus === 'speaking' ? 'animate-pulse' : ''}`} />

                <div className="flex items-start gap-4 mb-6">
                    <button
                        onClick={() => !isRealTime && playAudio(currentQuestion, sessionData?.strictness)} // Disable manual play in RT
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-colors ${speaking || rtStatus === 'speaking' ? 'bg-cyan-500 text-white shadow-cyan-500/50' : 'bg-white/10 text-cyan-400 hover:bg-white/20'}`}
                    >
                        <Volume2 className={`w-6 h-6 ${speaking || rtStatus === 'speaking' ? 'animate-pulse' : ''}`} />
                    </button>
                    <div className="flex-1">
                        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isRealTime ? 'text-green-400' : 'text-cyan-400'}`}>
                            {isRealTime ? `Real-Time Mode (${rtStatus})` : "Examiner Question"}
                        </h3>
                        <p className="text-2xl md:text-3xl font-light leading-relaxed text-white">
                            "{currentQuestion}"
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Answer Area */}
            <div className="glass-card p-6 md:p-8">
                {/* Visualizer */}
                {(isRecording || isRealTime) && (
                    <div className="w-full h-16 mb-4 bg-black/40 rounded-lg overflow-hidden border border-white/5">
                        <canvas ref={canvasRef} width={800} height={64} className="w-full h-full" />
                    </div>
                )}

                <textarea
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none mb-6"
                    placeholder={isRealTime ? "Listening via Real-Time Connection..." : "Your answer will appear here as you speak..."}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={loading || isRecording || isRealTime} // Read-only in RT mode basically
                    readOnly={isRecording || isRealTime}
                />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                    {isRealTime ? (
                        <div className="flex items-center gap-3 text-green-300/80 bg-green-900/20 px-6 py-3 rounded-full border border-green-500/30">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Mic is Live & Streaming (Speak anytime)</span>
                        </div>
                    ) : (
                        // Legacy Buttons
                        <>
                            {isProcessingAudio ? (
                                <button disabled className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-white/10 text-white/80 transition-all cursor-not-allowed">
                                    <Loader2 className="w-5 h-5 animate-spin" /> <span>Processing Audio...</span>
                                </button>
                            ) : (
                                !isRecording && !transcript && (
                                    <button onClick={startRecording} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105">
                                        <Mic className="w-6 h-6" /> <span>Tap to Speak</span>
                                    </button>
                                )
                            )}

                            {isRecording && (
                                <button onClick={stopRecording} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/25 transition-all transform hover:scale-105">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                    <span>Listening... (Tap to Stop)</span>
                                </button>
                            )}

                            {!isRecording && transcript && (
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button onClick={handleRetake} disabled={loading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors">
                                        <RefreshCcw className="w-5 h-5" /> <span>Retake</span>
                                    </button>
                                    <button onClick={handleSubmitAnswer} disabled={loading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25 transition-all transform hover:scale-105">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Submit Answer</span><Send className="w-5 h-5" /></>}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex items-center justify-center gap-2 text-red-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="text-xs text-white/30 text-center mt-4 font-mono">
                Mode: {isRealTime ? "Real-Time Full-Duplex" : (useServerSTT ? "Server (HQ)" : "Device (Fast)")} • v2.2
            </div>
        </div>
    );
};


export default VivaInterface;

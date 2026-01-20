import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Mic, Square, Send, Volume2, AlertCircle, Loader2, RefreshCcw, XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VivaInterface = ({ sessionData, onComplete, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(sessionData?.initial_question || 'Ready?');
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [speaking, setSpeaking] = useState(false);

    // TTS Function (Cloud/Edge)
    const audioRef = useRef(new Audio());

    const playAudio = async (text, strictness) => {
        try {
            setSpeaking(true);
            // Stop any current audio
            audioRef.current.pause();

            const response = await axios.post(`${API_BASE_URL}/api/speak`, {
                text: text,
                strictness: strictness || 'Moderate'
            }, {
                responseType: 'blob' // Important for audio file
            });

            const audioUrl = URL.createObjectURL(response.data);
            audioRef.current.src = audioUrl;

            audioRef.current.onended = () => {
                setSpeaking(false);
                URL.revokeObjectURL(audioUrl);
            };

            audioRef.current.onerror = () => {
                console.error("Audio playback error");
                setSpeaking(false);
            };

            await audioRef.current.play();
        } catch (err) {
            console.error("TTS Error:", err);
            setSpeaking(false);
            if (err.name === 'NotAllowedError') {
                setError('Autoplay blocked. Tap the speaker icon to hear the question.');
            }
        }
    };

    useEffect(() => {
        if (currentQuestion) {
            // Get strictness from sessionData or passed prop
            // Assuming sessionData has strictness, or default
            const modeStrictness = sessionData?.strictness || 'Moderate';
            playAudio(currentQuestion, modeStrictness);
        }
    }, [currentQuestion]);

    // Audio Visualization
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);

    const startVisualizer = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
            console.error("Error accessing microphone for visualizer:", err);
        }
    };

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
            canvasCtx.strokeStyle = '#06b6d4';
            canvasCtx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                // Amplify visual height
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
            sourceRef.current.disconnect();
            sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        }
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const speech = new window.webkitSpeechRecognition();
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
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    setError('Microphone access denied. Please check your permissions.');
                }
                setIsRecording(false);
            };

            setRecognition(speech);
        } else {
            // Check if user is likely on a mobile WebView (like LinkedIn app)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isWebView = /(LinkedInApp|FBAN|FBAV)/.test(navigator.userAgent);

            if (isMobile && isWebView) {
                setError('Voice features may not work inside this app. Please tap "..." and select "Open in Chrome/Browser".');
            } else {
                setError('Voice recognition not supported. Please use Google Chrome or Microsoft Edge.');
            }
        }

        return () => {
            stopVisualizer();
            audioContextRef.current?.close();
        };
    }, []);

    const startRecording = () => {
        setTranscript('');
        setError('');
        window.speechSynthesis.cancel();
        setIsRecording(true);
        recognition?.start();
        startVisualizer();
    };

    const stopRecording = () => {
        setIsRecording(false);
        recognition?.stop();
        stopVisualizer();
    };

    const handleRetake = () => {
        setTranscript('');
        startRecording();
    };

    const handleSubmitAnswer = async () => {
        if (!transcript.trim()) return;

        setLoading(true);
        setError('');

        if (isRecording) {
            recognition?.stop();
            stopVisualizer();
            setIsRecording(false);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/answer`, {
                session_id: sessionData.session_id,
                transcript: transcript
            });

            if (response.data.status === 'completed') {
                onComplete(response.data.feedback);
            } else {
                setCurrentQuestion(response.data.current_question);
                setTranscript('');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to submit answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEndInterview = async () => {
        if (!window.confirm("Are you sure you want to end the interview now?")) return;

        setLoading(true);
        if (isRecording) {
            stopRecording();
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/end`, {
                session_id: sessionData.session_id
            });

            if (response.data.status === 'completed') {
                onComplete(response.data.feedback);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to end interview.');
            setLoading(false);
        }
    };

    const handleBackConfirm = () => {
        if (window.confirm("Are you sure you want to go back? Your progress for this session will be lost.")) {
            onBack();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">

            <div className="flex justify-between items-center">
                <button
                    onClick={handleBackConfirm}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <button
                    onClick={handleEndInterview}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                >
                    <XCircle className="w-4 h-4" />
                    <span>End Interview</span>
                </button>
            </div>

            {/* Examiner Card */}
            <motion.div
                layout
                className="glass-card p-8 md:p-10 relative overflow-hidden transition-all"
            >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500 ${speaking ? 'animate-pulse' : ''}`} />

                <div className="flex items-start gap-4 mb-6">
                    <button
                        onClick={() => playAudio(currentQuestion, sessionData?.strictness)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-colors ${speaking ? 'bg-cyan-500 text-white shadow-cyan-500/50' : 'bg-white/10 text-cyan-400 hover:bg-white/20'}`}
                    >
                        <Volume2 className={`w-6 h-6 ${speaking ? 'animate-pulse' : ''}`} />
                    </button>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                            {sessionData?.mode === 'presentation' ? "Presentation Stage" : "Examiner Question"}
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
                {isRecording && (
                    <div className="w-full h-16 mb-4 bg-black/40 rounded-lg overflow-hidden border border-white/5">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={64}
                            className="w-full h-full"
                        />
                    </div>
                )}

                <textarea
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none mb-6"
                    placeholder="Your answer will appear here as you speak..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={loading || isRecording}
                    readOnly={isRecording}
                />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                    {!isRecording && !transcript && (
                        <button
                            onClick={startRecording}
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
                        >
                            <Mic className="w-6 h-6" />
                            <span>Tap to Speak</span>
                        </button>
                    )}

                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/25 transition-all transform hover:scale-105"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <span>Listening... (Tap to Stop)</span>
                        </button>
                    )}

                    {!isRecording && transcript && (
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleRetake}
                                disabled={loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                <span>Retake</span>
                            </button>

                            <button
                                onClick={handleSubmitAnswer}
                                disabled={loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25 transition-all transform hover:scale-105"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Submit Answer</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex items-center justify-center gap-2 text-red-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VivaInterface;

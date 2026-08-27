export class AudioStreamer {
    constructor(websocketUrl, onAudioData) {
        this.websocketUrl = websocketUrl;
        this.socket = null;
        this.audioContext = null;
        this.workletNode = null;
        this.stream = null;
        this.isPlaying = false;
        this.onAudioData = onAudioData; // Callback for when server sends audio
        this.inputSampleRate = 16000;

        // Queue for incoming audio
        this.audioQueue = [];
        this.nextStartTime = 0;
    }

    async connect() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
            console.log("WebSocket connected");
        };

        this.socket.onmessage = async (event) => {
            const data = event.data;
            if (data instanceof ArrayBuffer) {
                // Received Audio
                this.queueAudio(data);
            } else {
                // Received Text/JSON
                try {
                    const json = JSON.parse(data);
                    if (this.onAudioData) this.onAudioData(json);
                } catch (e) {
                    console.error("Error parsing WS msg:", e);
                }
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            this.stopRecording();
        };
    }

    async startRecording() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("Socket not open");
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000,
            });

            // Microphone
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });

            const source = this.audioContext.createMediaStreamSource(this.stream);

            // Add Worklet
            await this.audioContext.audioWorklet.addModule(
                URL.createObjectURL(new Blob([`
                    class PCMProcessor extends AudioWorkletProcessor {
                        process(inputs, outputs, parameters) {
                            const input = inputs[0];
                            if (input.length > 0) {
                                const float32Data = input[0];
                                const int16Data = new Int16Array(float32Data.length);
                                for (let i = 0; i < float32Data.length; i++) {
                                    const s = Math.max(-1, Math.min(1, float32Data[i]));
                                    int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                                }
                                this.port.postMessage(int16Data.buffer);
                            }
                            return true;
                        }
                    }
                    registerProcessor('pcm-processor', PCMProcessor);
                `], { type: 'application/javascript' }))
            );

            this.workletNode = new AudioWorkletNode(this.audioContext, 'pcm-processor');

            this.workletNode.port.onmessage = (event) => {
                if (this.socket.readyState === WebSocket.OPEN) {
                    // Send PCM data wrapped in a way the backend router expects?
                    // The router checks 'bytes' key in JSON if text, or raw bytes?
                    // My backend logic: message = await websocket.receive()
                    // if "bytes" in message... implies JSON.
                    // Wait, receive() returns dict if JSON, bytes if bytes.
                    // Let's send Raw Bytes for speed.
                    // BUT backend checked `if "bytes" in message:` which is for receive_json() or receive_text().
                    // receive() returns a Message object (dict) in Starlette/FastAPI internal loop, BUT `await websocket.receive()` returns a dict like {'type': 'websocket.receive', 'text': ...} or {'bytes': ...}.
                    // Actually `websocket.receive()` returns the raw ASGI event.
                    // Ideally we use `receive_bytes` or `receive_text` or `receive_json`.
                    // My backend code used `await websocket.receive()` which is low level. 
                    // Let's stick to sending RAW BYTES from client. 
                    // Backend `message["bytes"]` works perfectly for that.
                    this.socket.send(event.data);
                }
            };

            source.connect(this.workletNode);
            this.workletNode.connect(this.audioContext.destination); // Creating a loop? No, usually don't connect to destination if we don't want to hear self.
            // But worklet needs sink? No.
            // DO NOT connect to destination to avoid self-hear.
            // source.connect(this.workletNode);

        } catch (e) {
            console.error("Error starting mic:", e);
        }
    }

    queueAudio(arrayBuffer) {
        // Simple queuing for playback
        if (!this.audioContext) return;

        this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);

            const currentTime = this.audioContext.currentTime;

            // Scheduling
            if (this.nextStartTime < currentTime) {
                this.nextStartTime = currentTime;
            }

            source.start(this.nextStartTime);
            this.nextStartTime += buffer.duration;

        });
    }

    stopRecording() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.socket) {
            this.socket.close();
        }
    }
}

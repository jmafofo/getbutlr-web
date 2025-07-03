
'use client';

import { useState } from 'react';
import ToolHeader from '@/components/ToolHeader';

export default function VoiceToScriptPage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/voice-script', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setTranscript(result.transcript);
      setRecording(false);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // auto-stop after 5s
  };

  return (
    <div className="tool-container">
      <ToolHeader
        icon="🎙️"
        title="Voice to Script"
        description="Record your voice and turn it into a video script"
      />

      <div className="tool-content">
        <button onClick={handleStartRecording} disabled={recording} className="btn">
          {recording ? 'Recording...' : 'Start Recording'}
        </button>

        {transcript && (
          <div className="transcript-box">
            <h3>Your Script:</h3>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}

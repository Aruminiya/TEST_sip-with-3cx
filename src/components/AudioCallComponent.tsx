import { useState, useRef } from 'react';

function AudioCallComponent() {
  const [dnnumber, setDnnumber] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [destination, setDestination] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const makeCall = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_3CX_HOST}/callcontrol/${dnnumber}/makecall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          reason: 'Initiating call',
          destination: destination,
          timeout: 30
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Call initiated:', data);
        // data.result.id 就是 participantId
        setParticipantId(data.result.id);
      } else {
        console.error('Failed to initiate call:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await sendAudioStream(event.data);
        }
      };

      mediaRecorderRef.current.start(1000); // 每秒發送一次音頻數據
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const sendAudioStream = async (audioBlob: Blob) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_3CX_HOST}/callcontrol/${dnnumber}/participants/${participantId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/pcm',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: audioBlob
      });

      if (response.ok) {
        console.log('Audio stream sent successfully');
      } else {
        console.error('Failed to send audio stream:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="DN Number" value={dnnumber} onChange={(e) => setDnnumber(e.target.value)} />
      <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <button onClick={makeCall}>Make Call</button>
      <button onClick={startRecording}>Start Recording</button>
    </div>
  );
}

export default AudioCallComponent;
import React, { useState, useRef } from 'react';
import AuthService from "../services/auth.service";

const AudioRecorder = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const recordingInterval = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const user = AuthService.getCurrentUser();
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecordingTime(0)
    setIsRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
        setMessage('Audio is empty!');
        return
    }
    const formData = new FormData();

    formData.append('file', audioBlob, 'recording.wav');
    try {
      const response = await fetch('http://localhost:3010/api/upload', { 
        method: 'POST',
        body: formData,
        headers: {
            'userId': user.response.uid
        }
      });
      
      if (response.ok) {
        setMessage('Audio uploaded successfully');
        console.log('Audio uploaded successfully');
      } else {
        setMessage('Failed to upload audio');
        console.error('Failed to upload audio');
      }
      setAudioBlob(null)
    } catch (error) {
      console.error('Error uploading audio', error);
      setMessage('Error uploading audio');
      setAudioBlob(null)
    }

    setTimeout(function() {
        setMessage("");
    }, 3000);

  };

  // const downloadAudio = () => {
  //   if (audioBlob) {
  //     const url = URL.createObjectURL(audioBlob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'recording.wav';
  //     a.click();
  //   }
  // };

  // const [file, setFile] = useState(null); 
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0])
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await fetch(`http://localhost:3010/api/upload`, {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'userId': user.response.uid
  //       }
  //     });
      
  //     if (response.ok) {
  //       setMessage('File uploaded successfully!');
  //     } else {
  //       setMessage('File upload failed.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setMessage('File upload failed.');
  //   }
  // };

  return (
    <div>
        <div>
            {isRecording && (<p> Recording audio...  {recordingTime} seconds</p>)}

            <button style={{ borderRadius: '5px' }} onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-mic-fill"
                viewBox="0 0 16 16"
                style={{ marginRight: '5px' }}
                >
                <path d="M8 1a2 2 0 0 1 2 2v6a2 2 0 0 1-4 0V3a2 2 0 0 1 2-2z" />
                <path d="M5 8a3 3 0 0 0 6 0V3a3 3 0 0 0-6 0v5z" />
                <path d="M8 15a4.978 4.978 0 0 0 3-1.001V14a1 1 0 0 1-2 0v-1h1a3 3 0 0 0 0-6H7a3 3 0 0 0 0 6h1v1a1 1 0 0 1-2 0v-.001A4.978 4.978 0 0 0 8 15zM3.5 9a.5.5 0 0 0 0-1 .5.5 0 0 0 0 1z" />
                </svg>
            </button>
        </div>
    
      <div>
        <button style={{ marginTop: '10px', borderRadius: '5px' }} onClick={uploadAudio}>Upload Audio</button>
        {/* {audioBlob && <button style={{ marginTop: '10px', marginLeft: "10px", borderRadius: '5px' }} onClick={downloadAudio}>Download Audio</button>} */}
      </div>
      
      {/* <div style={{ marginTop: '10px' }}>
        <form onSubmit={handleSubmit}>
          <div>
            <input style={{ borderRadius: '2px' }} type="file" accept="audio/*" onChange={handleFileChange} />
          </div>
          <div style={{ marginTop: '10px' }} ><button type="submit">Upload</button></div>
        </form>
      </div>     */}
      <p>{message}</p>
    </div>
  );
};

export default AudioRecorder;

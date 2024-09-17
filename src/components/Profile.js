import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";


const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [file, setFile] = useState(null); 
  const [message, setMessage] = useState('');
  const [s3Files, sets3Files] = useState([]);

  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const fetchAudioFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3010/api/audio/lists");
      if (!response.ok) {
        throw new Error("Failed to fetch audio files");
      }
      const data = await response.json();
      sets3Files(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchAudio = async (fileName) => {
    setIsLoading(true);
    try {
        const response = await fetch(`http://localhost:3010/api/audio/${fileName}`);
        const blob = await response.blob();

        const audioObjectUrl = URL.createObjectURL(blob);
        setAudioUrl(audioObjectUrl);
        console.log("blobblobblob", audioObjectUrl)
        setIsLoading(false);
    } catch (error) {
        console.error('Error fetching audio:', error);
        setIsLoading(false);
    }
  };

  const handlePlay = (url) => {
    setCurrentPlaying(url)
    fetchAudio(url);
  };

 useEffect(() => {
    fetchAudioFiles();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3010/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('File upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('File upload failed.');
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.response.email}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Id:</strong> {currentUser.response.uid}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.response.email}
      </p>

      <div>
      <h2><strong> Upload a File</strong> </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
          </div>
          <br></br>
          <div>
            <button type="submit">Upload</button>
          </div>
        </form>
        <p>{message}</p>
      </div>

      <div>
      <h2>Audio Recordings</h2>
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Date</th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center' }}>
              <strong>Loading...</strong>
            </td>
          </tr>
        ) : (
          s3Files.map((file, index) => (
            <tr key={index}>
              <td>{file.Key}</td>
              <td>{file.LastModified}</td>
              <td>
              <div>
                  <button
                    onClick={() => handlePlay(file.Key)}
                    disabled={isLoading && currentPlaying === file.Key}>
                    {isLoading && currentPlaying === file.Key ? 'Loading...' : 'Play'}
                  </button>
                  {audioUrl && currentPlaying === file.Key && (
                    <audio controls autoPlay>
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </table>
    </div>
    </div>
  );
};

export default Profile;

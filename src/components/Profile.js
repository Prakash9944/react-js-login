import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import AudioRecorder from "./MediaRecorder.js"

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [s3Files, sets3Files] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAudioFiles = async () => {
    setIsLoading(true);
    try {
      const user = AuthService.getCurrentUser();
      const response = await fetch(`http://localhost:3010/api/audio/lists`, {
        headers: {
          'userId': user.response.uid
      }
      });
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

 useEffect(() => {
    fetchAudioFiles();
  }, []);

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
      <AudioRecorder/>
      </div>

      <div>
      <h2>Audio Recordings</h2>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Filename</th>
            <th>Date</th>
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
              <td><strong>{index+1}</strong></td>
              <td>{file.Key}</td>
              <td>{file.LastModified}</td>
              <td>
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

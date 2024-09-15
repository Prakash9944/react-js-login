import React, { useState } from "react";
import AuthService from "../services/auth.service";


const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  const [file, setFile] = useState(null); 
  const [message, setMessage] = useState('');

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
            <input type="file" onChange={handleFileChange} />
          </div>
          <br></br>
          <div>
            <button type="submit">Upload</button>
          </div>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Profile;

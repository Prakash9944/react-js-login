import { useState } from 'react';
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

let VerifyOtp = ({ email }) => {
  let [otp, setOtp] = useState('');
  const navigate = useNavigate();

  let handleSubmitOtp = () => {
    AuthService.verifyOtp(email , otp).then((result) => {
        if (result.data && result.data.response === "SUCCESS") {
            navigate("/login");
            alert("Otp Verified successfully!")
        } else {
            alert("Invalid otp message!")
        }
    })
  };

  return (
    <div>
      <h3>Enter OTP</h3>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleSubmitOtp}>Verify OTP</button>
    </div>
  );
};

export default VerifyOtp;

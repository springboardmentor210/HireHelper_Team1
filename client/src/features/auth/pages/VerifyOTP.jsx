import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { verifyOTP, resendOTP } from "../services/auth.service";

import "./VerifyOTP.css";
const VerifyOTP = () => {
   const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  if (!email) {
    return (
      <div className="otp-wrapper">
        <div className="otp-content">
          <h2>Invalid Access</h2>
          <p>Please register first.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const otpCode = otp.join("");

  if (otpCode.length !== 6) {
    return alert("Please enter all 6 digits.");
  }

  try {
    setLoading(true);

    const response = await verifyOTP({
      email,
      otp: otpCode,
    });

    alert(response.message);

    navigate("/login");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "OTP Verification Failed"
    );

  } finally {

    setLoading(false);

  }
};

 const handleResend = async () => {

  try {

    const response = await resendOTP(email);

    alert(response.message);

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to resend OTP"
    );

  }

};

  return (
    <div className="otp-wrapper">
      <div className="otp-content">
        <p className="otp-subtitle">
          We've sent a 6-digit verification<br />
          code to your email address.
        </p>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} 
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-box"
                autoComplete="off"
              />
            ))}
          </div>
          
         <button type="submit" className="verify-btn" disabled={loading}>
         {loading ? "Verifying..." : "Verify Code"}
         </button>
        </form>

        <p className="resend-text">
          Didn't receive the code? <button type="button" className="resend-link" onClick={handleResend}>Resend</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;

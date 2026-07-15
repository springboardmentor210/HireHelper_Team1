import { useState, useRef } from 'react';
import './VerifyOTP.css';
const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Verifying 6-digit OTP:', otp.join(''));
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
          
          <button type="submit" className="verify-btn">
            Verify Code
          </button>
        </form>

        <p className="resend-text">
          Didn't receive the code? <button type="button" className="resend-link">Resend</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";

import "./Register.css";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      if(onlyNumbers.length <= 10) {
        setFormData({ ...formData, [name]: onlyNumbers });
      }
    }
    else{
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await registerUser(formData);

    toast.success(response.message || "Account created! Please verify your email.");

    navigate("/verify-otp", {
      state: {
        email: formData.email,
      },
    });

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Registration failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="register-container">
      
      
      <div className="register-left">
        <div className="image-grid">
          
          <div className="grid-item img-1"></div>
          <div className="grid-item img-2"></div>
          <div className="grid-item img-3"></div>
          <div className="grid-item img-4"></div>
          <div className="grid-item img-5"></div>
          <div className="grid-item img-6"></div>
          <div className="grid-item img-7"></div>
        </div>
      </div>

      
      <div className="register-right">
        <div className="register-card">
          
          <div className="register-header">
            <div className="profile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <h2>Create Account</h2>
            <p className="subtitle">Join HireHelper and start helping people</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            
            
            <div className="name-row">
              <div className="input-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            
            <div className="input-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="Enter your phone number (Optional)" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
             </div>

              <button
                type="submit"
                  className="register-btn"
                  disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
             </button>
          </form>

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Register;
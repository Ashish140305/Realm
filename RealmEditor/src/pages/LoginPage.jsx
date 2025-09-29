// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaApple, FaUser, FaLock } from 'react-icons/fa';
import '../styles/AuthPage.css';
import ParticleBackground from '../components/ui/ParticleBackground';
import RealmLogo from '../assets/RealmLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(true); // Start as faded out

  // Fade in on page load
  useEffect(() => {
    setIsFading(false);
  }, []);

  const handleNavigate = (path) => {
    setIsFading(true); // Start fade-out
    setTimeout(() => {
      navigate(path); // Navigate after animation
    }, 300); // This duration should match the CSS transition
  };

  return (
    <div className="auth-page-container">
      <ParticleBackground />
      <div className={`auth-content-overlay ${isFading ? 'fading-out' : ''}`}>
        <div className="auth-hero-text">
          <h1>Welcome Back to Realm</h1>
          <p>Your Collaborative Coding Canvas</p>
        </div>
        <div className="auth-form-panel">
          <form className="auth-form">
            <RealmLogo />
            <h2>Login</h2>
            <div className="input-group">
              <FaUser className="input-icon" />
              <label htmlFor="userid">UserID</label>
              <input type="text" id="userid" placeholder="Enter your UserID" />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your Password" />
            </div>
            <button type="button" className="continue-btn" onClick={() => handleNavigate('/editor')}>
              Continue
            </button>
            <button type="button" className="auth-link" onClick={() => handleNavigate('/signup')}>
              New Here, Create Account
            </button>
            <div className="divider"><span>OR</span></div>
            <div className="social-login-buttons">
              <button type="button" className="social-btn"><FcGoogle /> Continue with Google</button>
              <button type="button" className="social-btn"><FaMicrosoft style={{ color: '#00A4EF' }} /> Continue with Microsoft</button>
              <button type="button" className="social-btn"><FaApple /> Continue with Apple</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
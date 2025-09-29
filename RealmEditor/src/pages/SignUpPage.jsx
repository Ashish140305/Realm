// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import '../styles/AuthPage.css';
import ParticleBackground from '../components/ui/ParticleBackground';
import RealmLogo from '../assets/RealmLogo';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    setIsFading(false);
  }, []);

  const handleNavigate = (path) => {
    setIsFading(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <div className="auth-page-container">
      <ParticleBackground />
      <div className={`auth-content-overlay ${isFading ? 'fading-out' : ''}`}>
        <div className="auth-hero-text">
          <h1>Join Realm</h1>
          <p>Start your journey of collaborative creation.</p>
        </div>
        <div className="auth-form-panel">
          <form className="auth-form">
            <RealmLogo />
            <h2>Create Account</h2>
            <div className="input-group">
              <FaUser className="input-icon" />
              <label htmlFor="userid">UserID</label>
              <input type="text" id="userid" placeholder="Choose a UserID" />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Create a password" />
            </div>
            <button type="button" className="continue-btn" onClick={() => handleNavigate('/editor')}>
              Sign Up
            </button>
            <button type="button" className="auth-link" onClick={() => handleNavigate('/login')}>
              Already have an account? Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
// src/components/auth/SignUpForm.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import RealmLogo from '../../assets/RealmLogo';

export default function SignUpForm() {
  const handleNavigate = useOutletContext();
  return (
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
  );
}
// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);
  const isLogin = location.pathname === '/login';

  // This effect handles the fade-in when you first arrive
  useEffect(() => {
    setIsFading(false);
  }, [location]);

  // This function will be passed to the forms to handle animated navigation
  const handleNavigate = (path) => {
    setIsFading(true);
    setTimeout(() => {
      navigate(path);
    }, 300); // Match CSS transition duration
  };

  return (
    <div className="auth-page-container">
      <ParticleBackground />
      <div className="auth-content-overlay">
        <div className={`auth-hero-text ${isFading ? 'fading-out' : ''}`}>
          <h1>{isLogin ? 'Welcome Back' : 'Join Realm'}</h1>
          <p>{isLogin ? 'Your Collaborative Coding Canvas' : 'Start your journey of collaborative creation.'}</p>
        </div>
        <div className={`auth-form-panel ${isFading ? 'fading-out' : ''}`}>
          {/* Outlet renders the child route (LoginForm or SignUpForm) */}
          <Outlet context={handleNavigate} />
        </div>
      </div>
    </div>
  );
}
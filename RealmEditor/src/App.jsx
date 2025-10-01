// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import EditorPage from './pages/EditorPage';

// This new, more robust component will fix the scroll issue
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a small timeout to ensure this command runs AFTER the browser
    // has attempted to scroll to a hash link (#features).
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10); // 10ms delay is usually enough

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
    
  }, [pathname]); // This effect runs every time the route changes

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>

        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}
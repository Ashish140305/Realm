import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all necessary pages and components
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import OverviewPage from './pages/OverviewPage';
import EditorPage from './pages/EditorPage';
import ThemeManager from './components/ui/ThemeManager';
import SessionNotification from './components/overview/SessionNotification';
import PresenceTracker from './components/ui/PresenceTracker';

export default function App() {
  return (
    <Router>
      <ThemeManager />
      <PresenceTracker />
      <SessionNotification />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthPage />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route path="/overview" element={<OverviewPage />} />
        {/* Updated Route */}
        <Route path="/editor/:projectName" element={<EditorPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} hideProgressBar />
    </Router>
  );
}
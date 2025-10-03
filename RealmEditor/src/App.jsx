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

export default function App() {
  return (
    <Router>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* The AuthPage now correctly wraps the login and signup routes */}
        <Route element={<AuthPage />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} hideProgressBar />
    </Router>
  );
}
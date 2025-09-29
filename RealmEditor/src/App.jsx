// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage'; // Import the new layout page
import LoginForm from './components/auth/LoginForm'; // Import the form components
import SignUpForm from './components/auth/SignUpForm';
import EditorPage from './pages/EditorPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Nested Routes for Login and Sign Up within the AuthPage layout */}
        <Route element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>

        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}
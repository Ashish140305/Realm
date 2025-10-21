import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaApple, FaUser, FaLock } from 'react-icons/fa';
import RealmLogo from '../../assets/RealmLogo';
import useSettingsStore from '../../store/useSettingsStore';

export default function LoginForm() {
    const handleNavigate = useOutletContext();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { updateProfile } = useSettingsStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId || !password) {
            setError('UserID and Password are required.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password }),
            });

            if (response.ok) {
                const profileResponse = await fetch(`/api/profile/${userId}`);
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    updateProfile(profileData);
                    handleNavigate('/overview');
                } else {
                    setError('Login successful, but could not fetch profile.');
                }
            } else {
                // FIX: Better error handling for server errors
                if (response.status >= 500) {
                    setError('Server error. Please try again later.');
                } else {
                    const errorMessage = await response.text();
                    setError(errorMessage || 'Login failed. Please check your credentials.');
                }
            }
        } catch (err) {
            setError('Could not connect to the server. Please check the backend console.');
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <RealmLogo />
            <h2>Login</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div className="input-group">
                <FaUser className="input-icon" />
                <label htmlFor="userid">UserID</label>
                <input
                    type="text"
                    id="userid"
                    placeholder="Enter your UserID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <div className="input-group">
                <FaLock className="input-icon" />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="continue-btn">
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
    );
}

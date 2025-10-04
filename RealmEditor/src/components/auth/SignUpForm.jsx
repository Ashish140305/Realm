import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import RealmLogo from '../../assets/RealmLogo';

export default function SignUpForm() {
    const handleNavigate = useOutletContext();
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId || !email || !password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email, password }),
            });

            if (response.ok) {
                // On successful registration, navigate to the login page
                handleNavigate('/login');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again later.');
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <RealmLogo />
            <h2>Create Account</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div className="input-group">
                <FaUser className="input-icon" />
                <label htmlFor="userid">UserID</label>
                <input
                    type="text"
                    id="userid"
                    placeholder="Choose a UserID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <div className="input-group">
                <FaEnvelope className="input-icon" />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group">
                <FaLock className="input-icon" />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="continue-btn">
                Sign Up
            </button>
            <button type="button" className="auth-link" onClick={() => handleNavigate('/login')}>
                Already have an account? Login
            </button>
        </form>
    );
}
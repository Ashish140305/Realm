import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc"; // Corrected import path
import { FaMicrosoft, FaApple } from "react-icons/fa6";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', { username, password });
            
            toast.success('Login successful! Redirecting...');
            
            localStorage.setItem('username', username);

            navigate('/overview');

        } catch (err) {
            setError('Invalid username or password. Please try again.');
            toast.error('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
            {error && <p className="form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        autoComplete="username"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className="form-button">Continue</button>
            </form>
            <div className="form-footer">
                <p>New Here, <a href="/signup">Create Account</a></p>
                <div className="divider">OR</div>
                <button className="social-button">
                    <FcGoogle /> Continue with Google
                </button>
                <button className="social-button">
                    <FaMicrosoft /> Continue with Microsoft
                </button>
                <button className="social-button">
                    <FaApple /> Continue with Apple
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc"; // Corrected import path
import { FaMicrosoft, FaApple } from "react-icons/fa6";

const SignUpForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !username || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('/api/auth/signup', { name, username, email, password });
            
            toast.success('Sign-up successful! Please log in.');
            navigate('/login');

        } catch (err) {
            setError('Failed to sign up. Please try a different username or email.');
            toast.error('Sign-up failed.');
            console.error('Sign-up error:', err);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Create Account</h2>
            {error && <p className="form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
                </div>
                <button type="submit" className="form-button">Continue</button>
            </form>
            <div className="form-footer">
                <p>Already have an account? <a href="/login">Log In</a></p>
                <div className="divider">OR</div>
                <button className="social-button"><FcGoogle /> Continue with Google</button>
                <button className="social-button"><FaMicrosoft /> Continue with Microsoft</button>
                <button className="social-button"><FaApple /> Continue with Apple</button>
            </div>
        </div>
    );
};

export default SignUpForm;
// src/components/auth/LoginForm.jsx
import React, { useState } from 'react'; // useState is needed for the functionality
import { useOutletContext } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaApple, FaUser, FaLock } from 'react-icons/fa';
import RealmLogo from '../../assets/RealmLogo';

export default function LoginForm() {
  const handleNavigate = useOutletContext(); // Access the navigation function from the parent

  /* --- LOGIN FUNCTIONALITY (COMMENTED OUT) ---
     To enable, uncomment all of this code.
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!userId) newErrors.userId = 'UserID is required.';
    if (!password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      // The correct password is 'password123'
      if (password === 'password123') {
        handleNavigate('/editor');
      } else {
        setErrors({ form: 'Invalid UserID or Password.' });
      }
      setIsLoading(false);
    }, 1500);
  };

  --- END OF FUNCTIONALITY --- */

  return (
    // To enable, add: onSubmit={handleSubmit} noValidate
    <form className="auth-form">
      <RealmLogo />
      <h2>Login</h2>
      
      {/* To enable, uncomment the line below */}
      {/* {errors.form && <p className="error-message form-error">{errors.form}</p>} */}

      <div className="input-group">
        <FaUser className="input-icon" />
        <label htmlFor="userid">UserID</label>
        <input 
          type="text" 
          id="userid" 
          placeholder="Enter your UserID" 
          // To enable, add the following props:
          // value={userId}
          // onChange={(e) => setUserId(e.target.value)}
          // className={errors.userId ? 'input-error' : ''}
        />
        {/* To enable, uncomment the line below */}
        {/* {errors.userId && <p className="error-message">{errors.userId}</p>} */}
      </div>

      <div className="input-group">
        <FaLock className="input-icon" />
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          placeholder="Enter your Password" 
          // To enable, add the following props:
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          // className={errors.password ? 'input-error' : ''}
        />
        {/* To enable, uncomment the line below */}
        {/* {errors.password && <p className="error-message">{errors.password}</p>} */}
      </div>

      <button 
        type="button" // Change to type="submit" to enable
        className="continue-btn" 
        onClick={() => handleNavigate('/editor')}
        // To enable, remove onClick and add: disabled={isLoading}
      >
        Continue
        {/* To enable, change the text inside the button to: {isLoading ? 'Continuing...' : 'Continue'} */}
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
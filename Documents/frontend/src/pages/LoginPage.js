import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Clear error on component mount and when dependencies change
  useEffect(() => {
    console.log('LoginPage mounted, clearing error'); // Debug
    setError('');
    setIsSubmitting(false);
    setLoading(false);
  }, []);

  // Monitor error state changes
  useEffect(() => {
    console.log('Error state changed to:', error); // Debug
    console.trace('Error state change stack trace'); // Debug
  }, [error]);

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      console.log('Clearing error on email change'); // Debug
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) {
      console.log('Clearing error on password change'); // Debug
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Form already submitting, ignoring'); // Debug
      return;
    }
    
    setIsSubmitting(true);
    console.log('=== FORM SUBMISSION START ==='); // Debug
    console.log('Current form values:', { email, password }); // Debug
    
    // Clear any existing error immediately
    setError('');
    console.log('Error cleared, current error state:', ''); // Debug

    if (!email || !password) {
      console.log('Validation failed: empty fields'); // Debug
      setIsSubmitting(false);
      return setError('Please fill in all fields');
    }

    console.log('Validation passed, proceeding with login...'); // Debug

    try {
      setLoading(true);
      console.log('Loading set to true'); // Debug
      console.log('Attempting login with:', { email, password }); // Debug
      const response = await login(email, password);
      console.log('Login response received:', response); // Debug
      
      if (response) {
        console.log('Login successful, navigating to dashboard'); // Debug
        // Clear error before navigation
        setError('');
        navigate('/dashboard');
      } else {
        console.log('No response from login'); // Debug
        setError('Login failed: No response');
      }
    } catch (error) {
      console.error('Login error caught:', error); // Debug
      const errorMessage = error.message || 'Login failed';
      console.error('Setting error message:', errorMessage); // Debug
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      console.log('Loading set to false'); // Debug
      console.log('=== FORM SUBMISSION END ==='); // Debug
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-subtitle">Sign in to access the admin panel</p>
        </div>

        {/* Debug: Show current error state */}
        {console.log('Rendering LoginPage, current error:', error)}
        
        {error && (
          <div className="error-message" role="alert">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className={`btn ${loading ? 'btn-loading' : ''}`}
              disabled={loading || isSubmitting}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <div className="flex justify-center">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

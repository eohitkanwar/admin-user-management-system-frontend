import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import "../styles/auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Clear error on component mount and when dependencies change
  useEffect(() => {
    console.log('LoginPage mounted, clearing error'); // Debug
    setError('');
    setIsSubmitting(false);
    setLoading(false);
    
    // Check if user was redirected from logout
    if (location.state?.fromLogout) {
      toast.success('Successfully logged out', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);

  // Monitor error state changes
  useEffect(() => {
    console.log('Error state changed to:', error); // Debug
    console.trace('Error state change stack trace'); // Debug
  }, [error]);

  // Clear toast when user starts typing
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear any error toasts when user starts typing
    toast.dismiss();
    
    // Real-time email validation
    if (newEmail && !isValidEmail(newEmail)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear any error toasts when user starts typing
    toast.dismiss();
    if (error && error.includes('email')) {
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

    // Validate email format
    if (!isValidEmail(email)) {
      console.log('Validation failed: invalid email format'); // Debug
      setIsSubmitting(false);
      toast.error('Invalid email format. Please enter a valid email address.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return setError('Invalid email format');
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
        // Clear any existing toasts before showing login success
        toast.dismiss();
        // Show success toast with user's proper name
        const userName = response.user?.name || response.user?.username || 'User';
        toast.success(`${userName} logged in successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/dashboard');
      } else {
        console.log('No response from login'); // Debug
        setError('Login failed: No response');
      }
    } catch (error) {
      console.error('Login error caught:', error); // Debug
      
      // Extract specific error message from API response
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Setting error message:', errorMessage); // Debug
      
      // Show error toast notification only (no UI error box)
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Don't set error state to avoid showing red box
      setError('');
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
        
        {/* Error box removed - now using toast notifications only */}

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

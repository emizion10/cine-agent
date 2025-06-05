import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import Snackbar from '../components/Snackbar'; 
import { login, signup } from '../services/authService'; 
import CineAgentLogo from '../assets/svg/logo.svg'; 

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null); // State for Snackbar
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setSnackbar(null); // Clear previous snackbars
    try {
      await login({ username, password });
        setSnackbar({ message: 'Login successful!', type: 'success' });
      navigate('/home');
    } catch (err: unknown) {
      let errorMessage = 'Login failed.';
      if (err instanceof Error) {
        errorMessage = `Login failed: ${err.message}`;
      } else if (typeof err === 'string') {
        errorMessage = `Login failed: ${err}`;
      } else {
        errorMessage = 'An unknown error occurred during login.';
      }
      setSnackbar({ message: errorMessage, type: 'error' }); // Show error snackbar
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setSnackbar(null); // Clear previous snackbars
    try {
      const response = await signup({ email, username: name, password });
      console.log('Signup successful:', response);
      
      setSnackbar({ message: 'Sign up successful! Please log in.', type: 'success' });
      setIsLogin(true); // Switch to login form after successful signup
    } catch (err: unknown) {
      let errorMessage = 'Sign up failed.';
      if (err instanceof Error) {
        errorMessage = `Sign up failed: ${err.message}`;
      } else if (typeof err === 'string') {
        errorMessage = `Sign up failed: ${err}`;
      } else {
         errorMessage = 'An unknown error occurred during sign up.';
      }
      setSnackbar({ message: errorMessage, type: 'error' }); // Show error snackbar
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // TODO: Implement guest session logic in AuthContext if needed
    console.log('Continuing as guest');
    // For now, just navigate to home without setting auth state
    navigate('/home');
  };

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={CineAgentLogo} alt="CineAgent Logo" style={{ height: '80px' }} />
        </div>
        {/* Removed error message display: {error && <p className="error-message">{error}</p>} */}
        {loading ? (
          <p>Loading...</p>
        ) : isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignUp={() => setIsLogin(false)}
            onContinueAsGuest={handleContinueAsGuest}
          />
        ) : (
          <SignUpForm
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
      {/* Render Snackbar */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={handleSnackbarClose}
        />
      )}
    </div>
  );
};

export default AuthPage; 
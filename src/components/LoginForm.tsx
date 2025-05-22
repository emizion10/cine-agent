import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  onContinueAsGuest: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignUp, onContinueAsGuest }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Log In
        </button>
      </form>
      <div className="auth-options">
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="link-button">
            Sign Up
          </button>
        </p>
        <div className="guest-option">
          <span className="divider">or</span>
          <button onClick={onContinueAsGuest} className="guest-button">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 
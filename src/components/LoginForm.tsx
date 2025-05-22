import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onSwitchToSignUp: () => void;
  onContinueAsGuest: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignUp, onContinueAsGuest }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
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
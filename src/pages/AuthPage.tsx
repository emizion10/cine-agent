import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password });
    navigate('/home');
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // TODO: Implement signup logic
    console.log('Signup attempt:', { name, email, password });
    navigate('/home');
  };

  const handleContinueAsGuest = () => {
    // TODO: Implement guest session logic
    console.log('Continuing as guest');
    navigate('/home');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isLogin ? (
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
    </div>
  );
};

export default AuthPage; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CineAgentLogo from '../assets/svg/logo.svg';

const Header: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
  };

  return (
    <header className="App-header">
      <div className="header-logo">
        <img src={CineAgentLogo} alt="CineAgent Logo" style={{ height: '40px', marginRight: '10px' }} />
        <span className="cineagent-title">CineAgent</span>
      </div>
      <h1>{/* Removed unnecessary h1 tag */}</h1>
      <nav>
        <ul>
          <li><a href="#" className="button dashboard-button">Dashboard</a></li>
          <li><a href="#">My Watchlist (0)</a></li>
          
          {isAuthenticated ? (
            <li className="user-profile">
              <button onClick={() => setShowLogout(!showLogout)} className="username-button">
                {username}
              </button>
              {showLogout && (
                <div className="logout-dropdown">
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/auth" className="button login-signup-button">
                Login / Sign Up
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
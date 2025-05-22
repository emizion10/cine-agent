import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <h1><span className="cineagent-title">CineAgent</span></h1>
      <nav>
        <ul>
          <li><a href="#" className="button dashboard-button">Dashboard</a></li>
          <li><a href="#">My Watchlist (0)</a></li>
          <li>
            <Link to="/auth" className="button login-signup-button">
              Login / Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
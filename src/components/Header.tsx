import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <h1><span className="cineagent-title">CineAgent</span></h1>
      <nav>
        <ul>
          <li><a href="#" className="button dashboard-button">Dashboard</a></li>
          <li><a href="#">My Watchlist (0)</a></li>
          <li><a href="#" className="button login-signup-button">Login / Sign Up</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
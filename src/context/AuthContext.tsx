import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as authLogin, logout as authLogout } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); // Assuming username is also stored
    if (storedToken) {
      console.log('AuthContext: Found token in localStorage on load.', storedToken);
      setToken(storedToken);
      setIsAuthenticated(true);
      // If username is stored, load it
      if (storedUsername) {
          setUsername(storedUsername);
      }
    }
  }, []);

  const login = async (user: string, pass: string) => {
    try {
      // Call the login service (which now stores token in localStorage)
      await authLogin({ username: user, password: pass });
      
      // Retrieve token and potentially username from localStorage after successful login
      const storedToken = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username'); // Assuming backend returns and service stores username

      if (storedToken) {
          console.log('AuthContext: Token found in localStorage after successful login.', storedToken);
          setToken(storedToken);
          setIsAuthenticated(true);
          if (storedUsername) {
              setUsername(storedUsername);
          } else {
              // Handle case where username is not returned/stored by service
              setUsername(user); // Use the username from input as a fallback
          }
      } else {
          // This case should ideally not happen if authLogin stored the token
           console.error('AuthContext: Login successful, but token not found in localStorage.');
           setIsAuthenticated(false);
           setUsername(null);
           setToken(null);
      }

    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      setIsAuthenticated(false);
      setUsername(null);
      setToken(null);
      throw error; // Re-throw to be caught by UI components
    }
  };

  const logout = () => {
    authLogout(); // Call the logout service (which removes from localStorage)
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
    console.log('AuthContext: User logged out, token cleared.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
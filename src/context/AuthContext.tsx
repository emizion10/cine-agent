import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as authLogin, logout as authLogout } from '../services/authService';
import { getUsername } from '../utils/authStorage';
import { getToken } from '../utils/authStorage';

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

  useEffect(() => {
    const storedToken = getToken();
    const storedUsername = getUsername(); 
    if (storedToken) {
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
      await authLogin({ username: user, password: pass });
      const storedToken = getToken();
      const storedUsername = getUsername();

      if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          if (storedUsername) {
              setUsername(storedUsername);
          }
      } else {
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
    authLogout();
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
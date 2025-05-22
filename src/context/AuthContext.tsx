import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, storeAuthData, removeAuthData, getUsername } from '../utils/authStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check for token and username on initial load
  useEffect(() => {
    const token = getToken();
    const storedUsername = getUsername(); // Get username from storage

    if (token && storedUsername) {
      // In a real app, you would validate the token with your backend
      // For this example, we'll just assume a valid token and stored username means authenticated
      setIsAuthenticated(true);
      setUsername(storedUsername); // Set username from storage
    } else {
      // Clear storage if only one is present (inconsistent state)
      removeAuthData();
    }
  }, []);

  const login = (token: string, username: string) => {
    storeAuthData(token, username); // Store both token and username
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    removeAuthData(); // Remove both token and username
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
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
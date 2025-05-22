import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, storeToken, removeToken } from '../utils/authStorage';

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

  // Check for token on initial load
  useEffect(() => {
    const token = getToken();
    // In a real app, you would validate the token with your backend
    // For this example, we'll just assume a token means authenticated
    if (token) {
      // TODO: Fetch username from backend using the token after refresh
      // For now, we can't get the username just from the token without another API call
      // We might need to store username along with token or fetch user info on app load.
      // For simplicity now, we'll just set isAuthenticated true and leave username as null initially,
      // or fetch a placeholder/default username if the backend provides one with just a token.
      // A better approach would be to have an endpoint like /users/me that returns user info based on token.
      setIsAuthenticated(true);
      // setUsername('Placeholder User'); // Placeholder - ideally fetch this
    }
  }, []);

  const login = (token: string, username: string) => {
    storeToken(token);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    removeToken();
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
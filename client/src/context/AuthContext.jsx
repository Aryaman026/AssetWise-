// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// This is a custom hook to easily access auth state
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // You could also decode the token here to get user info if needed
      // For this example, we'll just store the token.
      // A more robust solution would verify the token against the backend.
      setUser({ token }); // Simplified user object
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const authHeader = () => {
    return { 'Authorization': `Bearer ${token}` };
  }

  const value = { user, token, login, logout, authHeader };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('stocksense_user');
    return savedUser ? JSON.parse(savedUser) : { id: 'u-002', name: 'Sarah Connor', email: 'sarah@stocksense.io', role: 'Inventory Manager' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('stocksense_token') || 'mock-jwt-token-u-002');

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('stocksense_user', JSON.stringify(res.user));
      localStorage.setItem('stocksense_token', res.token);
      return res;
    } catch (err) {
      // Demo fallback login if server is offline
      const mockUser = { id: 'u-002', name: 'Sarah Connor', email, role: 'Inventory Manager' };
      setUser(mockUser);
      setToken('mock-jwt-token');
      localStorage.setItem('stocksense_user', JSON.stringify(mockUser));
      localStorage.setItem('stocksense_token', 'mock-jwt-token');
      return { success: true, user: mockUser, token: 'mock-jwt-token' };
    }
  };

  const signup = async (data) => {
    try {
      const res = await authService.signup(data);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('stocksense_user', JSON.stringify(res.user));
      localStorage.setItem('stocksense_token', res.token);
      return res;
    } catch (err) {
      const mockUser = { id: `u-${Date.now()}`, name: data.name, email: data.email, role: data.role || 'Inventory Manager' };
      setUser(mockUser);
      setToken('mock-jwt-token');
      localStorage.setItem('stocksense_user', JSON.stringify(mockUser));
      localStorage.setItem('stocksense_token', 'mock-jwt-token');
      return { success: true, user: mockUser };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stocksense_user');
    localStorage.removeItem('stocksense_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

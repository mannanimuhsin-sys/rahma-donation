import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:8000/api/v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rahma_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me/`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login/`, { username, password });
    const { access, user: userData } = response.data;
    localStorage.setItem('rahma_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setToken(access);
    setUser(userData);
    return response.data;
  };

  const register = async (formData) => {
    const response = await axios.post(`${API_URL}/auth/register/`, formData);
    const { access, user: userData } = response.data;
    localStorage.setItem('rahma_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setToken(access);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('rahma_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

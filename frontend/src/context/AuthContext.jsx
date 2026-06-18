import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Axios defaults & interceptors
  useEffect(() => {
    const token = localStorage.getItem('shopez_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile(token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/auth/profile`);
      if (res.data.success) {
        setUser(res.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (res.data.success) {
        const { token, _id, name, email: userEmail } = res.data;
        localStorage.setItem('shopez_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ _id, name, email: userEmail });
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      if (res.data.success) {
        const { token, _id, name: userName, email: userEmail } = res.data;
        localStorage.setItem('shopez_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ _id, name: userName, email: userEmail });
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try a different email.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('shopez_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

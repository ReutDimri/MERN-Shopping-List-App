import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'

const AuthContext = createContext();

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'  //for production
  : 'http://localhost:5000'; //for development


const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });}
  }, []);

  const verifyToken  = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
        
      return { success: true };
    } catch (err) {
      console.log('login error!', err); 
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: res.data.user,
          token: res.data.token
        }
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    return axios.post('/api/users/register', { username, email, password })
    .then(r => {
      localStorage.setItem('token', r.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`;
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: r.data.user, token: r.data.token }});
      return { success: true };})
    .catch(e => {
      console.log('register failed!', e);
      return { success: false, error: e.response?.data?.error || 'Registration failed' };
    });
};

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {throw new Error('useAuth must be used within AuthProvider');}
  return context;
};
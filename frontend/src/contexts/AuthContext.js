import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: true,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  USER_LOADED: 'USER_LOADED',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.AUTH_ERROR:
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: true,
        loading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Load user function
  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await api.get('/auth/me');
        dispatch({
          type: AUTH_ACTIONS.USER_LOADED,
          payload: response.data.user
        });
      } catch (error) {
        dispatch({
          type: AUTH_ACTIONS.AUTH_ERROR,
          payload: error.response?.data?.message || 'Authentication failed'
        });
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });

      // Load user data after successful login
      await loadUser();
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });

      // Load user data after successful registration
      await loadUser();
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data.user
      });
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user && state.user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole('admin');

  // Check if user is recruiter
  const isRecruiter = () => hasRole('recruiter') || hasRole('admin');

  // Check if user is job seeker
  const isJobSeeker = () => hasRole('jobseeker') || hasRole('admin');

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    hasRole,
    isAdmin,
    isRecruiter,
    isJobSeeker,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
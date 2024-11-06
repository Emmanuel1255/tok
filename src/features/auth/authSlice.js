// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get initial session state from localStorage
const getInitialSession = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  
  if (token && user && sessionExpiry && new Date(sessionExpiry) > new Date()) {
    return {
      token,
      user,
      sessionExpiry,
      isAuthenticated: true
    };
  }
  
  // Clear localStorage if session is expired
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('sessionExpiry');
  
  return {
    token: null,
    user: null,
    sessionExpiry: null,
    isAuthenticated: false
  };
};

const loginAPI = async (credentials) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Add this for cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await loginAPI(credentials);
    
    // Store session data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('sessionExpiry', response.sessionExpiry || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
    
    return response;
  }
);

const registerAPI = async (userData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await registerAPI(userData);
    
    // Store session data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('sessionExpiry', response.sessionExpiry || 
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
    
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    return null;
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { dispatch }) => {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (!sessionExpiry || new Date(sessionExpiry) <= new Date()) {
      await dispatch(logout());
      throw new Error('Session expired');
    }
    return getInitialSession();
  }
);

const initialState = {
  ...getInitialSession(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
    // Register cases
    .addCase(register.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.status = 'idle';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionExpiry = action.payload.sessionExpiry;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(register.rejected, (state, action) => {
      state.status = 'idle';
      state.error = action.error.message;
      state.isAuthenticated = false;
    })
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiry = action.payload.sessionExpiry;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.sessionExpiry = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check session cases
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiry = action.payload.sessionExpiry;
        state.isAuthenticated = true;
      })
      .addCase(checkSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.sessionExpiry = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthStatus = (state) => state.auth.status;
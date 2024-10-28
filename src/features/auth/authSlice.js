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

// Simulated login API call
const loginAPI = async (credentials) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (credentials.email === 'test@example.com' && credentials.password === 'Password123!') {
    // Create session expiry 24 hours from now
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    return {
      user: {
        id: 1,
        email: credentials.email,
        name: 'Test User',
      },
      token: 'fake-jwt-token',
      sessionExpiry
    };
  }
  throw new Error('Invalid email or password');
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await loginAPI(credentials);
    
    // Store session data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('sessionExpiry', response.sessionExpiry);
    
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

// Check session validity
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
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.sessionExpiry = null;
        state.isAuthenticated = false;
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

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
// src/features/stats/statsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch statistics from the API
export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      );
    }
  }
);

// For admin: Update countries reached
export const updateCountriesReached = createAsyncThunk(
  'stats/updateCountriesReached',
  async (count, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/stats/countries', { count });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update countries count'
      );
    }
  }
);

const initialState = {
  stats: [
    { label: 'Active users', value: '0' },
    { label: 'Blog posts published', value: '0' },
    { label: 'Countries reached', value: '0' },
    { label: 'Uptime', value: '0%' },
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastUpdated: null
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Countries
      .addCase(updateCountriesReached.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCountriesReached.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the countries reached stat
        const countriesIndex = state.stats.findIndex(
          stat => stat.label === 'Countries reached'
        );
        if (countriesIndex !== -1) {
          state.stats[countriesIndex].value = action.payload.countriesReached.count + '+';
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCountriesReached.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllStats = (state) => state.stats.stats;
export const selectStatsStatus = (state) => state.stats.status;
export const selectStatsError = (state) => state.stats.error;
export const selectLastUpdated = (state) => state.stats.lastUpdated;

export const { clearError } = statsSlice.actions;

export default statsSlice.reducer;
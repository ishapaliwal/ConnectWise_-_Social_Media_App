import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '../../services/AuthService';
import { handleRequest } from '../../utils/request';

// --- Thunks --- //
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await handleRequest(() => authAPI.login(credentials));
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await handleRequest(() => authAPI.register(userData));
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem('authToken');
      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.message || 'Logout failed, token removed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    if (!token) return rejectWithValue('No token');

    try {
      const user = await handleRequest(() => authAPI.getCurrentUser());
      return { user, token };
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.message || 'Token invalid');
    }
  }
);

// --- Initial State --- //
const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: 'idle',
  error: null,
  initialCheckDone: false
};

// --- Slice --- //
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Login ---
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialCheckDone = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.initialCheckDone = true;
      })

      // --- Register ---
      .addCase(registerUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialCheckDone = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.initialCheckDone = true;
      })

      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = 'idle';
        state.error = null;
        state.initialCheckDone = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = 'failed';
        state.error = action.payload;
        state.initialCheckDone = true;
      })

      // --- Check Auth Status ---
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = 'pending';
        state.initialCheckDone = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialCheckDone = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = 'failed';
        state.initialCheckDone = true;
      });
  }
});

// --- Selectors --- //
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectInitialCheckDone = (state) => state.auth.initialCheckDone;

export default authSlice.reducer;
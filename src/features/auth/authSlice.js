import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apperService from '../../services/apperService';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Check if user is already authenticated from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

// Setup authentication with Apper
export const setupAuth = createAsyncThunk(
  'auth/setupAuth',
  async ({ elementId, onSuccess }, { dispatch }) => {
    apperService.setupAuth(elementId, {
      onSuccess: (user, account) => {
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispatch success action to update state
        dispatch(setUser(user));
        
        // Call the provided onSuccess callback if any
        if (onSuccess) {
          onSuccess(user, account);
        }
      },
      onError: (error) => {
        console.error('Authentication error:', error);
        dispatch(authError(error.message || 'Authentication failed'));
      }
    });
    
    return {}; // Return empty object as this thunk doesn't directly return data
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // Dispatch clear user action
    dispatch(clearUser());
    
    return {};
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    user: getUserFromStorage(),
    isAuthenticated: !!getUserFromStorage()
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    authError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setupAuth.fulfilled, (state) => {
        // The actual state update happens in the onSuccess callback
        state.status = 'idle';
      })
      .addCase(setupAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  }
});

export const { setUser, clearUser, authError } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
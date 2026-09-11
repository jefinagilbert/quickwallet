import { createSlice } from '@reduxjs/toolkit';
import { UserSessionData, tokenManager } from '../../../services';
import {
  loginUser,
  refreshAuthToken,
  logoutUser,
  initAuthSession,
} from '../../thunks/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserSessionData | null;
  token: string | null;
  tokenExpiry: number | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tokenExpiry: null,
  isLoading: false,
  isInitializing: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    logout: state => {
      tokenManager.stop();
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.expiryTimestamp;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload || 'Login failed';
    });

    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.expiryTimestamp;
    });
    builder.addCase(refreshAuthToken.rejected, state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
    });

    builder.addCase(logoutUser.fulfilled, state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(initAuthSession.pending, state => {
      state.isInitializing = true;
    });
    builder.addCase(initAuthSession.fulfilled, (state, action) => {
      state.isInitializing = false;
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenExpiry = action.payload.expiryTimestamp;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    });
    builder.addCase(initAuthSession.rejected, state => {
      state.isInitializing = false;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuthError, logout } = authSlice.actions;

export default authSlice.reducer;

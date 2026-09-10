import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
  token: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ email: string; token?: string }>,
    ) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload.email;
      state.token = action.payload.token || 'mock-jwt-token';
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setLoading, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;

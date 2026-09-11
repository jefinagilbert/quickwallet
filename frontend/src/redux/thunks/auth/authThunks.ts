import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  authService,
  LoginCredentials,
  AuthSuccessPayload,
  tokenManager,
} from '../../../services';

export const loginUser = createAsyncThunk<
  AuthSuccessPayload,
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const result = await authService.login(credentials);

    // Pre-emptively refresh token before 3-minute expiration
    tokenManager.start(() => {
      dispatch(refreshAuthToken());
    });

    return result;
  } catch (error: any) {
    const message =
      error?.error ||
      error?.message ||
      'Login failed. Please check your credentials.';
    return rejectWithValue(message);
  }
});

export const refreshAuthToken = createAsyncThunk<
  AuthSuccessPayload,
  void,
  { rejectValue: string }
>('auth/refreshAuthToken', async (_, { dispatch, rejectWithValue }) => {
  try {
    const result = await authService.refreshToken();

    tokenManager.start(() => {
      dispatch(refreshAuthToken());
    });

    return result;
  } catch (error: any) {
    tokenManager.stop();
    const message = error?.error || error?.message || 'Session expired.';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async () => {
    await authService.logout();
  },
);

export const initAuthSession = createAsyncThunk<
  AuthSuccessPayload | null,
  void
>('auth/initAuthSession', async (_, { dispatch }) => {
  try {
    const session = await authService.restoreSession();
    if (session) {
      tokenManager.start(() => {
        dispatch(refreshAuthToken());
      });
    }
    return session;
  } catch {
    return null;
  }
});

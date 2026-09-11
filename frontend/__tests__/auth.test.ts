import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/redux/slices/auth/authSlice';
import { loginUser } from '../src/redux/thunks/auth/authThunks';
import { authService } from '../src/services/auth/authService/authService';

jest.mock('../src/services/auth/authService/authService');
jest.mock('../src/services/auth/tokenManager/tokenManager', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  tokenManager: {
    start: jest.fn(),
    stop: jest.fn(),
  },
}));

describe('Auth Flow & Rejection Handling', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should start with unauthenticated state', () => {
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should reject login and remain unauthenticated when wrong password is provided', async () => {
    const mockError = {
      name: 'ApiError',
      code: 401,
      error: 'INVALID CREDENTIALS',
      message: 'INVALID CREDENTIALS',
    };

    (authService.login as jest.Mock).mockRejectedValueOnce(mockError);

    const resultAction = await store.dispatch(
      loginUser({
        email: 'test@example.com',
        password: 'wrong_password',
      }),
    );

    expect(loginUser.rejected.match(resultAction)).toBe(true);
    expect(resultAction.payload).toBe('INVALID CREDENTIALS');

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe('INVALID CREDENTIALS');
  });

  it('should authenticate user and store session payload on successful login', async () => {
    const mockSuccess = {
      user: {
        userId: 1,
        name: 'Test User',
        email: 'test@example.com',
      },
      token: 'jwt-access-token-123',
      expiryTimestamp: Date.now() + 180000,
    };

    (authService.login as jest.Mock).mockResolvedValueOnce(mockSuccess);

    const resultAction = await store.dispatch(
      loginUser({
        email: 'test@example.com',
        password: 'correct_password',
      }),
    );

    expect(loginUser.fulfilled.match(resultAction)).toBe(true);

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
    expect(state.token).toBe('jwt-access-token-123');
    expect(state.error).toBeNull();
  });
});

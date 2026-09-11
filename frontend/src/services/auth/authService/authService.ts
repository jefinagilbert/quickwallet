import {
  loginEndpoint,
  refreshTokenEndpoint,
  logoutEndpoint,
  signinEndpoint,
} from '../../api/endpoints/endpoints';
import { apiClient } from '../../api/apiClient/apiClient';
import {
  saveTokens,
  saveUserData,
  getAccessToken,
  getUserData,
  getTokenExpiry,
  clearSession,
  UserSessionData,
} from '../../storage/secureStorage/secureStorage';
import { stopAutoRefresh } from '../tokenManager/tokenManager';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UserAuthData {
  userId: number;
  name: string;
  email: string;
  access_token: string;
}

export interface AuthSuccessPayload {
  user: UserSessionData;
  token: string;
  expiryTimestamp: number;
}

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthSuccessPayload> => {
  const response = await apiClient.post<{ user: UserAuthData }>(
    loginEndpoint(),
    credentials,
    { requiresAuth: false },
  );

  const userData = response.data?.user;
  if (!userData || !userData.access_token) {
    throw new Error('Invalid authentication response from server');
  }

  const expiryDurationMs = 3 * 60 * 1000;
  const expiryTimestamp = Date.now() + expiryDurationMs;

  await saveTokens(userData.access_token, expiryDurationMs);
  await saveUserData({
    userId: userData.userId,
    name: userData.name,
    email: userData.email,
  });

  return {
    user: {
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
    },
    token: userData.access_token,
    expiryTimestamp,
  };
};

export const refreshToken = async (): Promise<AuthSuccessPayload> => {
  const currentToken = await getAccessToken();
  const response = await apiClient.post<{ user: UserAuthData }>(
    refreshTokenEndpoint(),
    { token: currentToken },
    { requiresAuth: true },
  );

  const userData = response.data?.user;
  if (!userData || !userData.access_token) {
    throw new Error('Failed to refresh access token');
  }

  const expiryDurationMs = 3 * 60 * 1000;
  const expiryTimestamp = Date.now() + expiryDurationMs;

  await saveTokens(userData.access_token, expiryDurationMs);
  await saveUserData({
    userId: userData.userId,
    name: userData.name,
    email: userData.email,
  });

  return {
    user: {
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
    },
    token: userData.access_token,
    expiryTimestamp,
  };
};

export const logout = async (): Promise<void> => {
  stopAutoRefresh();
  try {
    await apiClient.post(logoutEndpoint(), {}, { requiresAuth: true });
  } catch {
    // Ignore network failures during logout to allow local cleanup
  } finally {
    await clearSession();
  }
};

export const register = async (
  data: RegisterCredentials,
): Promise<{ name: string; email: string }> => {
  const response = await apiClient.post<{
    user: { name: string; email: string };
  }>(signinEndpoint(), data, { requiresAuth: false });
  return response.data.user;
};

export const restoreSession = async (): Promise<AuthSuccessPayload | null> => {
  const token = await getAccessToken();
  const user = await getUserData();
  const expiryTimestamp = await getTokenExpiry();

  if (!token || !user || !expiryTimestamp) {
    return null;
  }

  if (Date.now() >= expiryTimestamp) {
    try {
      return await refreshToken();
    } catch {
      await clearSession();
      return null;
    }
  }

  return {
    user,
    token,
    expiryTimestamp,
  };
};

apiClient.setTokenRefreshHandler(async () => {
  try {
    const result = await refreshToken();
    return result.token;
  } catch {
    return null;
  }
});

export const authService = {
  login,
  refreshToken,
  logout,
  register,
  restoreSession,
};

export default authService;

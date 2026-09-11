import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSessionData {
  userId: number;
  name: string;
  email: string;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@quickwallet:access_token',
  TOKEN_EXPIRY: '@quickwallet:token_expiry',
  USER_DATA: '@quickwallet:user_data',
} as const;

// In-memory cache mirror for instant synchronous lookups
const memoryCache = new Map<string, string>();

export const setItem = async (key: string, value: string): Promise<void> => {
  memoryCache.set(key, value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[SecureStorage] Error setting item for key "${key}":`, error);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      memoryCache.set(key, value);
      return value;
    }
    return memoryCache.get(key) ?? null;
  } catch (error) {
    console.warn(`[SecureStorage] Error getting item for key "${key}":`, error);
    return memoryCache.get(key) ?? null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  memoryCache.delete(key);
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(
      `[SecureStorage] Error removing item for key "${key}":`,
      error,
    );
  }
};

export const saveTokens = async (
  token: string,
  expiresInMs: number = 3 * 60 * 1000,
): Promise<void> => {
  const expiryTimestamp = Date.now() + expiresInMs;
  await setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  await setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTimestamp.toString());
};

export const getAccessToken = async (): Promise<string | null> => {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getAccessTokenSync = (): string | null => {
  return memoryCache.get(STORAGE_KEYS.ACCESS_TOKEN) ?? null;
};

export const getTokenExpiry = async (): Promise<number | null> => {
  const expiryStr = await getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  return expiryStr ? parseInt(expiryStr, 10) : null;
};

export const isTokenExpired = async (
  bufferMs: number = 30000,
): Promise<boolean> => {
  const expiry = await getTokenExpiry();
  if (!expiry) return true;
  return Date.now() >= expiry - bufferMs;
};

export const saveUserData = async (
  userData: UserSessionData,
): Promise<void> => {
  await setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserData = async (): Promise<UserSessionData | null> => {
  const json = await getItem(STORAGE_KEYS.USER_DATA);
  if (!json) return null;
  try {
    return JSON.parse(json) as UserSessionData;
  } catch {
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  memoryCache.delete(STORAGE_KEYS.ACCESS_TOKEN);
  memoryCache.delete(STORAGE_KEYS.TOKEN_EXPIRY);
  memoryCache.delete(STORAGE_KEYS.USER_DATA);

  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.TOKEN_EXPIRY,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.warn(
      '[SecureStorage] Error clearing session from AsyncStorage:',
      error,
    );
  }
};

export const secureStorage = {
  setItem,
  getItem,
  removeItem,
  saveTokens,
  getAccessToken,
  getAccessTokenSync,
  getTokenExpiry,
  isTokenExpired,
  saveUserData,
  getUserData,
  clearSession,
};

export default secureStorage;

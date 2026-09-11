import { Platform } from 'react-native';

const DEFAULT_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: DEFAULT_BASE_URL,
  TIMEOUT_MS: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  TOKEN_REFRESH_BUFFER_MS: 30 * 1000, // 30s buffer before expiration
  TOKEN_LIFETIME_MS: 3 * 60 * 1000, // 3 minutes
};

export default API_CONFIG;

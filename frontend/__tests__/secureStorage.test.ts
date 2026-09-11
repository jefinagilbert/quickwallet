import {
  saveTokens,
  getAccessToken,
  getAccessTokenSync,
  saveUserData,
  getUserData,
  clearSession,
  getTokenExpiry,
  isTokenExpired,
} from '../src/services/storage/secureStorage/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('SecureStorage Service (AsyncStorage + Memory Sync)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await clearSession();
  });

  it('should save and retrieve access token persistently', async () => {
    await saveTokens('jwt-test-token', 180000);

    const token = await getAccessToken();
    expect(token).toBe('jwt-test-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@quickwallet:access_token',
      'jwt-test-token',
    );

    // Synchronous accessor
    expect(getAccessTokenSync()).toBe('jwt-test-token');
  });

  it('should calculate expiry timestamp and check isTokenExpired', async () => {
    // 3 minutes expiry
    await saveTokens('jwt-test-token', 180000);

    const expiry = await getTokenExpiry();
    expect(expiry).toBeGreaterThan(Date.now());

    const expired = await isTokenExpired();
    expect(expired).toBe(false);
  });

  it('should save and parse user data object', async () => {
    const userPayload = {
      userId: 42,
      name: 'John Doe',
      email: 'john@example.com',
    };

    await saveUserData(userPayload);
    const user = await getUserData();

    expect(user).toEqual(userPayload);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@quickwallet:user_data',
      JSON.stringify(userPayload),
    );
  });

  it('should clear all session items on logout', async () => {
    await saveTokens('jwt-test-token', 180000);
    await saveUserData({
      userId: 42,
      name: 'John Doe',
      email: 'john@example.com',
    });

    await clearSession();

    expect(await getAccessToken()).toBeNull();
    expect(getAccessTokenSync()).toBeNull();
    expect(await getUserData()).toBeNull();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      '@quickwallet:access_token',
      '@quickwallet:token_expiry',
      '@quickwallet:user_data',
    ]);
  });
});

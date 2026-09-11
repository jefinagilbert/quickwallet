import { API_CONFIG } from '../../../constants/config/apiConfig';

type RefreshCallback = () => Promise<void> | void;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
// Triggers at 2m 30s (30s before 3-minute JWT expiry)
let customRefreshIntervalMs: number =
  API_CONFIG.TOKEN_LIFETIME_MS - API_CONFIG.TOKEN_REFRESH_BUFFER_MS;

export const setRefreshInterval = (intervalMs: number): void => {
  customRefreshIntervalMs = intervalMs;
};

export const startAutoRefresh = (onRefresh: RefreshCallback): void => {
  stopAutoRefresh();

  refreshTimer = setTimeout(async () => {
    try {
      await onRefresh();
    } catch (error) {
      console.warn('[tokenManager] Pre-emptive token refresh failed:', error);
    }
  }, customRefreshIntervalMs);
};

export const stopAutoRefresh = (): void => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const isAutoRefreshActive = (): boolean => {
  return refreshTimer !== null;
};

export const tokenManager = {
  start: startAutoRefresh,
  stop: stopAutoRefresh,
  setRefreshInterval,
  isActive: isAutoRefreshActive,
};

export default tokenManager;

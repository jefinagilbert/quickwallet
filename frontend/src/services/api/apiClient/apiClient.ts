import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../../../constants/config/apiConfig';
import { getAccessToken } from '../../storage/secureStorage/secureStorage';
import {
  createApiError,
  isApiError,
  ApiResponse,
  HttpMethod,
  RequestOptions,
} from '../types/apiTypes';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

export type TokenRefreshHandler = () => Promise<string | null>;
export type LogoutHandler = () => void;

let tokenRefreshHandler: TokenRefreshHandler | null = null;
let logoutHandler: LogoutHandler | null = null;
let isRefreshing: boolean = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

export const setBaseUrl = (url: string): void => {
  axiosInstance.defaults.baseURL = url;
};

export const setTokenRefreshHandler = (handler: TokenRefreshHandler): void => {
  tokenRefreshHandler = handler;
};

export const setLogoutHandler = (handler: LogoutHandler): void => {
  logoutHandler = handler;
};

const notifySubscribers = (token: string | null): void => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

const addSubscriber = (cb: (token: string | null) => void): void => {
  refreshSubscribers.push(cb);
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    ...API_CONFIG.HEADERS,
  },
});

axiosInstance.interceptors.request.use(
  async (config: CustomInternalAxiosRequestConfig) => {
    if (config.requiresAuth !== false) {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config as
      CustomInternalAxiosRequestConfig | undefined;

    // Intercept 401 and queue pending requests during token refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.requiresAuth !== false
    ) {
      const url = originalRequest.url || '';
      // Guard against infinite refresh loops on auth endpoints
      if (!url.includes('/auth/refresh') && !url.includes('/auth/login')) {
        if (isRefreshing) {
          return new Promise<AxiosResponse>((resolve, reject) => {
            addSubscriber((newToken: string | null) => {
              if (newToken) {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                resolve(axiosInstance(originalRequest));
              } else {
                reject(
                  createApiError(401, 'Session expired. Please log in again.'),
                );
              }
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = tokenRefreshHandler
            ? await tokenRefreshHandler()
            : null;
          isRefreshing = false;

          if (newToken) {
            notifySubscribers(newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axiosInstance(originalRequest);
          } else {
            notifySubscribers(null);
            logoutHandler?.();
            return Promise.reject(
              createApiError(401, 'Session expired. Please log in again.'),
            );
          }
        } catch {
          isRefreshing = false;
          notifySubscribers(null);
          logoutHandler?.();
          return Promise.reject(
            createApiError(401, 'Session expired. Please log in again.'),
          );
        }
      }
    }

    if (isApiError(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      const errorMessage =
        data && typeof data === 'object' && data.error
          ? data.error
          : data && typeof data === 'object' && data.message
            ? data.message
            : `Request failed with status code ${status}`;

      return Promise.reject(
        createApiError(
          data?.code || status,
          errorMessage,
          typeof data === 'object' ? data : undefined,
        ),
      );
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(
        createApiError(
          408,
          'Request timeout. Please check your network connection.',
        ),
      );
    }

    if (error.request) {
      return Promise.reject(
        createApiError(
          503,
          'Network error. Unable to reach the server. Please check your connection.',
        ),
      );
    }

    return Promise.reject(
      createApiError(
        500,
        error.message || 'An unexpected network error occurred.',
      ),
    );
  },
);

export const request = async <T = any>(
  method: HttpMethod,
  endpoint: string,
  body?: any,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
  const {
    requiresAuth = true,
    timeoutMs,
    headers,
    params,
    ...restOptions
  } = options;

  const config: CustomInternalAxiosRequestConfig = {
    url: endpoint,
    method,
    data: body,
    params,
    headers: headers as any,
    timeout: timeoutMs ?? API_CONFIG.TIMEOUT_MS,
    requiresAuth,
    ...restOptions,
  } as CustomInternalAxiosRequestConfig;

  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data;
};

export const get = <T = any>(
  endpoint: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> => request<T>('GET', endpoint, undefined, options);

export const post = <T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> => request<T>('POST', endpoint, body, options);

export const put = <T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> => request<T>('PUT', endpoint, body, options);

export const patch = <T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> => request<T>('PATCH', endpoint, body, options);

export const del = <T = any>(
  endpoint: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> =>
  request<T>('DELETE', endpoint, undefined, options);

export const apiClient = {
  instance: axiosInstance,
  request,
  get,
  post,
  put,
  patch,
  delete: del,
  setBaseUrl,
  setTokenRefreshHandler,
  setLogoutHandler,
};

export default apiClient;

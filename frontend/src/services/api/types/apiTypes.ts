import type { AxiosRequestConfig } from 'axios';

/**
 * Generic Backend API Response Structures (Functional Types)
 */

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  code: number;
  error: string;
  details?: Record<string, any>;
}

export interface ApiError extends Error {
  code: number;
  error: string;
  details?: Record<string, any>;
}

export const createApiError = (
  code: number,
  error: string,
  details?: Record<string, any>,
): ApiError => {
  const err = new Error(error) as ApiError;
  err.name = 'ApiError';
  err.code = code;
  err.error = error;
  err.details = details;
  return err;
};

export const isApiError = (error: any): error is ApiError => {
  return (
    error instanceof Error &&
    typeof (error as ApiError).code === 'number' &&
    typeof (error as ApiError).error === 'string'
  );
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions extends AxiosRequestConfig {
  requiresAuth?: boolean;
  timeoutMs?: number;
}

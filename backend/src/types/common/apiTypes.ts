// Generic API Responses
export interface ApiResponse<T> {
  code: number;
  data: T;
}

export interface ApiErrorResponse {
  code?: number;
  error: string;
}

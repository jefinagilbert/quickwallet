import type { Request } from 'express';
import type { JwtUserPayload } from '../auth/authTypes.js';

// Generic API Responses
export interface ApiResponse<T> {
  code: number;
  data: T;
}

export interface ApiErrorResponse {
  code?: number;
  error: string;
}

// Reusable Body-First Request Types
export interface TypedRequest<
  ReqBody = Record<string, unknown>,
  Params = Record<string, string>,
  Query = Record<string, unknown>,
> extends Request<Params, unknown, ReqBody, Query> {}

export interface AuthRequest<
  ReqBody = Record<string, unknown>,
  Params = Record<string, string>,
  Query = Record<string, unknown>,
> extends TypedRequest<ReqBody, Params, Query> {
  user?: JwtUserPayload;
}

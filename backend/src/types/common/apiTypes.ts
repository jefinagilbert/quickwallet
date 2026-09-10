import type { Request } from "express";
import type { JwtUserPayload } from "../auth/authTypes.js";

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
  ReqBody = Record<string, any>,
  Params = Record<string, string>,
  Query = Record<string, any>,
> extends Request<Params, any, ReqBody, Query> {}

export interface AuthRequest<
  ReqBody = Record<string, any>,
  Params = Record<string, string>,
  Query = Record<string, any>,
> extends TypedRequest<ReqBody, Params, Query> {
  user?: JwtUserPayload;
}

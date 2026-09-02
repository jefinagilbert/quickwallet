// Database Entities
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: Date | string;
}

export type UserPublic = Omit<User, "password">;

// Request / Response DTOs
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  name: string;
  email: string;
  access_token: string;
}

// JWT Auth Types
export interface JwtUserPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

// Express Request Augmentation for Authentication
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

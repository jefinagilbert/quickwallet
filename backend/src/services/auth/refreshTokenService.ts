import jwt from "jsonwebtoken";
import { findUserById } from "../../repositories/auth/authRepository.js";
import { ERROR_MESSAGES } from "../../constants/index.js";
import type {
  LoginResponse,
  JwtUserPayload,
} from "../../types/auth/authTypes.js";
import { AppError } from "../../types/common/errorTypes.js";
import { isTokenBlacklisted } from "./blacklistService.js";

const refreshTokenService = async (token: string): Promise<LoginResponse> => {
  const secret = process.env.ACCESS_TOKEN;
  if (!secret) {
    throw new AppError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  const isRevoked = await isTokenBlacklisted(token);
  if (isRevoked) {
    throw new AppError(401, "Token has been revoked. Please login again");
  }

  let decoded: JwtUserPayload;
  try {
    decoded = jwt.verify(token, secret, {
      ignoreExpiration: true,
    }) as JwtUserPayload;
  } catch {
    throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED_INVALID_EXPIRED);
  }

  if (!decoded || !decoded.userId) {
    throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED_INVALID_EXPIRED);
  }

  const user = await findUserById(decoded.userId);
  if (!user) {
    throw new AppError(401, ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST);
  }

  const access_token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: "5m",
  });

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    access_token,
  };
};

export default refreshTokenService;

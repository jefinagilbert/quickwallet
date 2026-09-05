import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/index.js";
import type { JwtUserPayload } from "../types/auth/authTypes.js";
import type { ApiErrorResponse } from "../types/common/apiTypes.js";
import { isTokenBlacklisted } from "../services/auth/blacklistService.js";

const requireAuth = async (
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      code: 401,
      error: ERROR_MESSAGES.UNAUTHORIZED_USER,
    });
    return;
  }

  const authToken = authHeader.split(" ")[1];
  if (!authToken) {
    res.status(401).json({
      code: 401,
      error: ERROR_MESSAGES.UNAUTHORIZED_USER,
    });
    return;
  }

  const secret = process.env.ACCESS_TOKEN;
  if (!secret) {
    res.status(500).json({
      code: 500,
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
    return;
  }

  try {
    const isRevoked = await isTokenBlacklisted(authToken);
    if (isRevoked) {
      res.status(401).json({
        code: 401,
        error: "Token has been revoked. Please login again",
      });
      return;
    }
    const decoded = jwt.verify(authToken, secret);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      typeof (decoded as { userId: unknown }).userId === "number"
    ) {
      req.user = decoded as JwtUserPayload;
      next();
    } else {
      res.status(401).json({
        code: 401,
        error: ERROR_MESSAGES.UNAUTHORIZED_INVALID_EXPIRED,
      });
    }
  } catch {
    res.status(401).json({
      code: 401,
      error: ERROR_MESSAGES.UNAUTHORIZED_INVALID_EXPIRED,
    });
  }
};

export { requireAuth };

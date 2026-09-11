import type { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/index.js";
import refreshTokenService from "../../services/auth/refreshTokenService.js";
import type { LoginResponse } from "../../types/auth/authTypes.js";
import type {
  ApiErrorResponse,
  ApiResponse,
} from "../../types/common/apiTypes.js";
import { isAppError } from "../../types/common/errorTypes.js";

const refreshTokenController = async (
  req: Request,
  res: Response<ApiResponse<{ user: LoginResponse }> | ApiErrorResponse>,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const bodyToken = req.body?.token || req.body?.refresh_token;

    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (bodyToken) {
      token = bodyToken;
    }

    if (!token) {
      res.status(401).json({
        code: 401,
        error: ERROR_MESSAGES.UNAUTHORIZED_USER,
      });
      return;
    }

    const result = await refreshTokenService(token);

    res.status(200).json({
      code: 200,
      data: {
        user: result,
      },
    });
  } catch (e: unknown) {
    if (isAppError(e)) {
      res.status(e.code).json({
        code: e.code,
        error: e.message || e.error || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    const message =
      e instanceof Error ? e.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      code: 500,
      error: message,
    });
  }
};

export default refreshTokenController;

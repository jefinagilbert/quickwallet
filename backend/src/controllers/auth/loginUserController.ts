import type { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/index.js";
import loginUserService from "../../services/auth/loginUserService.js";
import type {
  LoginResponse,
  LoginUserInput,
} from "../../types/auth/authTypes.js";
import type {
  ApiErrorResponse,
  ApiResponse,
} from "../../types/common/apiTypes.js";
import { isAppError } from "../../types/common/errorTypes.js";

const loginUserController = async (
  req: Request<Record<string, never>, unknown, LoginUserInput>,
  res: Response<ApiResponse<{ user: LoginResponse }> | ApiErrorResponse>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result: LoginResponse = await loginUserService(email, password);

    res.status(202).json({
      code: 202,
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

export default loginUserController;

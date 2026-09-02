import type { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/index.js";
import createUserService from "../../services/auth/createUserService.js";
import type {
  CreateUserInput,
  UserPublic,
} from "../../types/auth/authTypes.js";
import type {
  ApiErrorResponse,
  ApiResponse,
} from "../../types/common/apiTypes.js";
import { isAppError } from "../../types/common/errorTypes.js";

const createUserController = async (
  req: Request<Record<string, never>, unknown, CreateUserInput>,
  res: Response<ApiResponse<{ userDetails: UserPublic }> | ApiErrorResponse>,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const result: UserPublic = await createUserService(name, email, password);

    res.status(201).json({
      code: 201,
      data: {
        userDetails: result,
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

export default createUserController;

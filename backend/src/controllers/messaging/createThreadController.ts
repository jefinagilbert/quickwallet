import type { Response } from "express";
import { ERROR_MESSAGES } from "../../constants/index.js";
import type { AuthRequest } from "../../middlewares/authMiddleware.js";
import createThreadService from "../../services/messaging/createThreadService.js";
import type {
  ApiErrorResponse,
  ApiResponse,
} from "../../types/common/apiTypes.js";
import { isAppError } from "../../types/common/errorTypes.js";
import type {
  CreateThreadInput,
  IThreadReturnSuccessType,
} from "../../types/messaging/createThreads.types.js";

const createThreadController = async (
  req: AuthRequest<CreateThreadInput>,
  res: Response<ApiResponse<IThreadReturnSuccessType> | ApiErrorResponse>,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      code: 401,
      error: ERROR_MESSAGES.UNAUTHORIZED_USER,
    });
    return;
  }

  const { user_ids } = req.body;
  const currentUserId = req.user.userId;

  // Include the current authenticated user in participants and remove duplicates
  const participants = Array.from(
    new Set(user_ids ? [...user_ids, currentUserId] : [currentUserId]),
  );

  try {
    const result = await createThreadService(participants);
    res.status(200).json({
      code: 200,
      data: {
        threadId: result.threadId,
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

export default createThreadController;

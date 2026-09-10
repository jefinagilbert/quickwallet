import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/authMiddleware.js";
import type {
  ApiErrorResponse,
  ApiResponse,
} from "../../types/common/apiTypes.js";

import { ERROR_MESSAGES } from "../../constants/index.js";
import getInboxService from "../../services/messaging/getInboxService.js";
import { isAppError } from "../../types/index.js";

export interface InboxData {
  threadId: number;
  isGroup: boolean;
  name?: string;
  lastMessage: string;
  lastActive: string;
}

const getInboxController = async (
  req: AuthRequest,
  res: Response<ApiResponse<InboxData> | ApiErrorResponse>,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      code: 401,
      error: ERROR_MESSAGES.UNAUTHORIZED_USER,
    });
    return;
  }

  const { userId } = req.user;

  try {
    const result = await getInboxService(userId);

    res.status(200).json({
      code: 200,
      data: result,
    });
  } catch (e) {
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

export default getInboxController;

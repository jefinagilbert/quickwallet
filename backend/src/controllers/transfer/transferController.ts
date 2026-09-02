import type { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/index.js";
import transferService from "../../services/transfer/transferService.js";
import type { ApiErrorResponse } from "../../types/common/apiTypes.js";
import { isAppError } from "../../types/common/errorTypes.js";
import type {
  TransferInput,
  TransferResult,
} from "../../types/transfer/transferTypes.js";

const transferController = async (
  req: Request<Record<string, never>, unknown, TransferInput>,
  res: Response<TransferResult | ApiErrorResponse>,
): Promise<void> => {
  const { senderId, receiverId, description, amount_in_cents } = req.body;
  try {
    const result: TransferResult = await transferService(
      senderId,
      receiverId,
      description,
      amount_in_cents,
    );
    res.status(result.code).json(result);
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

export default transferController;

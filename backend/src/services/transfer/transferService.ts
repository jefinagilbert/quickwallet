import { ERROR_MESSAGES } from "../../constants/index.js";
import transferRepository from "../../repositories/transfer/transferRepository.js";
import { AppError } from "../../types/common/errorTypes.js";
import type { TransferResult } from "../../types/transfer/transferTypes.js";

const transferService = async (
  senderId: number,
  receiverId: number,
  description: string,
  amount_in_cents: number,
): Promise<TransferResult> => {
  if (senderId === receiverId) {
    throw new AppError(400, ERROR_MESSAGES.SAME_USER);
  }
  if (amount_in_cents <= 0) {
    throw new AppError(400, ERROR_MESSAGES.INVALID_AMOUNT);
  }
  const repositoryResult: TransferResult = await transferRepository(
    senderId,
    receiverId,
    description,
    amount_in_cents,
  );
  return repositoryResult;
};

export default transferService;

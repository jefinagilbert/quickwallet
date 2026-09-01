import { ERROR_MESSAGES } from "../../constants/index.js";
import transferRepository from "../../repositories/transfer/transferRepository.js";

const transferService = async (
  senderId,
  receiverId,
  description,
  amount_in_cents,
) => {
  if (senderId == receiverId) {
    throw {
      code: 400,
      error: ERROR_MESSAGES.SAME_USER,
    };
  }
  if (amount_in_cents <= 0) {
    throw {
      code: 400,
      error: ERROR_MESSAGES.INVALID_AMOUNT,
    };
  }
  const repositoryResult = await transferRepository(
    senderId,
    receiverId,
    description,
    amount_in_cents,
  );
  return repositoryResult;
};

export default transferService;

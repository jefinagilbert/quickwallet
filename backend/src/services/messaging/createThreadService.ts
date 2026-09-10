import createThreadRepository from "../../repositories/messaging/createThreadRepository.js";
import findDuplicateThread from "../../repositories/messaging/findDuplicateThread.js";
import { IThreadReturntype } from "../../types/messaging/createThreads.types.js";

const createThreadService = async (
  user_ids: Array<number>,
): IThreadReturntype => {
  let isGroup = false;
  if (user_ids.length > 2) {
    isGroup = true;
  }
  const result = await findDuplicateThread(user_ids);
  if (result?.error || !result?.threadId) {
    return await createThreadRepository(user_ids, isGroup);
  } else {
    return {
      threadId: result.threadId,
    };
  }
};

export default createThreadService;

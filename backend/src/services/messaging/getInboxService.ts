import { InboxData } from "../../controllers/messaging/getInboxController.js";
import getInboxRepository from "../../repositories/messaging/getInboxRepository.js";

const getInboxService = async (userId: number): Promise<InboxData> => {
  try {
    const result = await getInboxRepository(userId);
    return result;
  } catch (e) {
    throw e;
  }
};

export default getInboxService;

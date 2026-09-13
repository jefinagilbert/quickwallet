import { InboxData } from '../../controllers/messaging/getInboxController.js';
import getInboxRepository from '../../repositories/messaging/getInboxRepository.js';

const getInboxService = async (userId: number): Promise<InboxData> => {
  return await getInboxRepository(userId);
};

export default getInboxService;

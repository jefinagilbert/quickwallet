import pool from '../../config/db.js';
import { ERROR_MESSAGES } from '../../constants/index.js';
import { AppError } from '../../types/index.js';
import { IThreadReturntype } from '../../types/messaging/createThreads.types.js';

const createThreadRepository = async (
  userIds: Array<number>,
  isGroup: boolean,
): IThreadReturntype => {
  const client = await pool.connect();

  await client.query('BEGIN');

  try {
    const thread_data = await client.query(
      `
            INSERT INTO threads (is_group_chat) VALUES ($1) 
            RETURNING id
        `,
      [isGroup],
    );

    const threadId = thread_data.rows[0].id;

    const participantsQuery = `
            INSERT INTO threads_participants (thread_id, user_id)
            VALUES ($1, $2)
        `;

    for (const userid of userIds) {
      await client.query(participantsQuery, [threadId, userid]);
    }

    await client.query(`COMMIT`);

    return {
      threadId,
    };
  } catch (_e: unknown) {
    await client.query(`ROLLBACK`);
    throw new AppError(500, ERROR_MESSAGES.SOMETHING_WENT_WRONG);
  } finally {
    client.release();
  }
};

export default createThreadRepository;

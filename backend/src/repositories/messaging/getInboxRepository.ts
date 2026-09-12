import pool from '../../config/db.js';
import { ERROR_MESSAGES } from '../../constants/index.js';
import { AppError } from '../../types/index.js';

const getInboxRepository = async (userId: number) => {
  const SQL_QUERY = `
    SELECT 
    t.id AS thread_id,
    t.is_group_chat,
    lm.content AS last_message,
    lm.created_at AS last_activity_time,
    other_tp.user_id AS receiver_user_id
    FROM threads_participants tp

    JOIN threads t
    ON tp.thread_id = t.id

    LEFT JOIN threads_participants other_tp
    ON other_tp.thread_id = tp.thread_id
    AND other_tp.user_id != $1

    LEFT JOIN LATERAL (
        SELECT 
            content,
            created_at,
            sender_id
        FROM messages
        WHERE thread_id = t.id
        ORDER BY id DESC
        LIMIT 1
    ) lm ON true

    WHERE tp.user_id = $1
    ORDER BY lm.created_at DESC NULLS LAST;
  `;

  const result = await pool.query(SQL_QUERY, [userId]);
  if (result) {
    const data = result.rows[0];
    return {
      threadId: data.thread_id,
      isGroup: data?.is_group_chat,
      lastMessage: data?.last_message,
      lastActive: data?.last_activity_time,
      receiverUserId: data?.receiver_user_id,
    };
  } else {
    throw new AppError(500, ERROR_MESSAGES.SOMETHING_WENT_WRONG);
  }
};

export default getInboxRepository;

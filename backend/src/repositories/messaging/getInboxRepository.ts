import pool from "../../config/db.js";
import { ERROR_MESSAGES } from "../../constants/index.js";
import { AppError } from "../../types/index.js";

const getInboxRepository = async (userId: number) => {
  const SQL_QUERY = `
      SELECT 
          t.id AS thread_id,
          t.is_group_chat,
          lm.content AS last_message,
          lm.created_at AS last_activity_time
      FROM threads_participants tp
      JOIN threads t ON tp.thread_id = t.id
      -- The LATERAL join acts like a super-fast "For Loop" inside Postgres
      LEFT JOIN LATERAL (
          SELECT content, created_at
          FROM messages
          WHERE thread_id = t.id
          ORDER BY id DESC
          LIMIT 1
      ) lm ON true
      WHERE tp.user_id = $1
      ORDER BY lm.created_at DESC NULLS LAST;
     `;

  try {
    const result = await pool.query(SQL_QUERY, [userId]);
    console.log(result.rows[0]);
    if (result) {
      const data = result.rows[0];
      return {
        threadId: data.thread_id,
        isGroup: data?.is_group_chat,
        lastMessage: data?.last_message,
        lastActive: data?.last_activity_time,
      };
    } else {
      throw new AppError(500, ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  } catch (e) {
    throw e;
  }
};

export default getInboxRepository;

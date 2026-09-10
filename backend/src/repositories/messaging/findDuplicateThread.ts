import pool from "../../config/db.js";

interface IFindDuplicate {
  error?: string;
  threadId?: number;
}

const findDuplicateThread = async (
  userIds: Array<number>,
): Promise<IFindDuplicate> => {
  const sortedUserIds = Array.from(new Set(userIds)).sort((a, b) => a - b);

  const SQL_QUERY = `
        SELECT thread_id FROM threads_participants
        GROUP BY thread_id HAVING ARRAY_AGG(user_id ORDER BY user_id) = $1::int[]
    `;

  const result = await pool.query(SQL_QUERY, [sortedUserIds]);

  if (result?.rows && result.rows.length > 0 && result.rows[0]?.thread_id) {
    return {
      threadId: Number(result.rows[0].thread_id),
    };
  } else {
    return {
      error: "Dont Exist",
    };
  }
};

export default findDuplicateThread;

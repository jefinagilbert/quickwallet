import pool from "../../config/db.js";
import { ERROR_MESSAGES, TRANSACTION_STATUS } from "../../constants/index.js";

const transferRepository = async (
  senderId,
  receiverId,
  description,
  amount_in_cents,
) => {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const firstId = Math.min(senderId, receiverId);
    const secondId = Math.max(senderId, receiverId);

    const userResult = await client.query(
      `
            SELECT * from users WHERE id IN ($1, $2) ORDER BY id FOR UPDATE
        `,
      [firstId, secondId],
    );

    await client.query("SELECT pg_sleep(10)");

    if (userResult.rows.length != 2) {
      throw {
        code: 404,
        error: ERROR_MESSAGES.SENDER_OR_RECEIVER_ACCOUNT_DOES_NOT_EXIST,
      };
    }

    let transactionId;
    try {
      const transactionResult = await client.query(
        `
                INSERT INTO transactions (description, status) VALUES ($1, 'PENDING')
                RETURNING id
            `,
        [description],
      );
      transactionId = transactionResult.rows[0].id;
    } catch (e) {
      if (e.code == "23505") {
        throw {
          code: 409,
          error: ERROR_MESSAGES.DUPLICATION_TRANSFER_DETECTED,
        };
      }
      throw e;
    }

    const balanceResult = await client.query(
      `
            SELECT COALESCE(SUM(amount_in_cents), 0) AS balance FROM ledger_entries 
            WHERE user_id = $1
        `,
      [senderId],
    );

    if (BigInt(balanceResult.rows[0].balance) < BigInt(amount_in_cents)) {
      await client.query(
        `
                UPDATE transactions SET status='FAILED' WHERE id=$1
            `,
        [transactionId],
      );
      await client.query(`COMMIT`);
      throw {
        code: 400,
        error: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
      };
    }

    await client.query(
      `
            INSERT INTO ledger_entries (transaction_id, user_id, amount_in_cents)
            VALUES ($1, $2, $4), ($1, $3, $5)
        `,
      [transactionId, senderId, receiverId, -amount_in_cents, amount_in_cents],
    );

    await client.query(
      `
            UPDATE transactions SET status='COMPLETED' WHERE id=$1
        `,
      [transactionId],
    );

    await client.query(`COMMIT`);

    return {
      code: 200,
      data: {
        transaction_status: TRANSACTION_STATUS.COMPLETED,
        transferred_amount: amount_in_cents,
      },
    };
  } catch (e) {
    await client.query(`ROLLBACK`);
    throw e;
  } finally {
    client.release();
  }
};

export default transferRepository;

import pool from "../../config/db.js";
import { ERROR_MESSAGES, TRANSACTION_STATUS } from "../../constants/index.js";
import type { User } from "../../types/auth/authTypes.js";
import { AppError } from "../../types/common/errorTypes.js";
import type { TransferResult } from "../../types/transfer/transferTypes.js";
import type { PoolClient, QueryResult } from "pg";

interface PgErrorWithCode {
  code?: string;
  message?: string;
}

const isPgErrorWithCode = (err: unknown): err is PgErrorWithCode => {
  return typeof err === "object" && err !== null && "code" in err;
};

const transferRepository = async (
  senderId: number,
  receiverId: number,
  description: string,
  amount_in_cents: number,
): Promise<TransferResult> => {
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const firstId = Math.min(senderId, receiverId);
    const secondId = Math.max(senderId, receiverId);

    const userResult: QueryResult<User> = await client.query<User>(
      `
        SELECT * from users WHERE id IN ($1, $2) ORDER BY id FOR UPDATE
      `,
      [firstId, secondId],
    );

    if (userResult.rows.length !== 2) {
      throw new AppError(
        404,
        ERROR_MESSAGES.SENDER_OR_RECEIVER_ACCOUNT_DOES_NOT_EXIST,
      );
    }

    let transactionId: string;
    try {
      const transactionResult: QueryResult<{ id: string }> =
        await client.query<{ id: string }>(
          `
            INSERT INTO transactions (description, status) VALUES ($1, 'PENDING')
            RETURNING id
          `,
          [description],
        );
      const transactionRow = transactionResult.rows[0];
      if (!transactionRow) {
        throw new AppError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
      transactionId = transactionRow.id;
    } catch (e: unknown) {
      if (isPgErrorWithCode(e) && e.code === "23505") {
        throw new AppError(409, ERROR_MESSAGES.DUPLICATION_TRANSFER_DETECTED);
      }
      throw e;
    }

    const balanceResult: QueryResult<{ balance: string | number }> =
      await client.query<{ balance: string | number }>(
        `
          SELECT COALESCE(SUM(amount_in_cents), 0) AS balance FROM ledger_entries 
          WHERE user_id = $1
        `,
        [senderId],
      );

    const balanceRow = balanceResult.rows[0];
    const rawBalance = balanceRow ? balanceRow.balance : "0";
    const currentBalance = BigInt(rawBalance);

    if (currentBalance < BigInt(amount_in_cents)) {
      await client.query(
        `
          UPDATE transactions SET status='FAILED' WHERE id=$1
        `,
        [transactionId],
      );
      await client.query("COMMIT");
      throw new AppError(400, ERROR_MESSAGES.INSUFFICIENT_FUNDS);
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

    await client.query("COMMIT");

    return {
      code: 200,
      data: {
        transaction_status: TRANSACTION_STATUS.COMPLETED,
        transferred_amount: amount_in_cents,
      },
    };
  } catch (e: unknown) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export default transferRepository;

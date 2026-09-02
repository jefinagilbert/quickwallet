import pool from "../../config/db.js";
import type { User, UserPublic } from "../../types/auth/authTypes.js";
import type { PoolClient, QueryResult } from "pg";

const findUserByEmail = async (email: string): Promise<User | null> => {
  const sqlQuery = `
    SELECT * FROM users WHERE email = $1;
  `;
  const result: QueryResult<User> = await pool.query<User>(sqlQuery, [email]);
  return result.rows[0] ?? null;
};

const findUserById = async (id: number): Promise<User | null> => {
  const sqlQuery = `
    SELECT * FROM users WHERE id = $1;
  `;
  const result: QueryResult<User> = await pool.query<User>(sqlQuery, [id]);
  return result.rows[0] ?? null;
};

const createUser = async (
  name: string,
  email: string,
  password: string,
): Promise<Pick<User, "name" | "email" | "created_at"> | null> => {
  const sqlQuery = `
    INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
    RETURNING name, email, created_at;
  `;
  const result: QueryResult<Pick<User, "name" | "email" | "created_at">> =
    await pool.query<Pick<User, "name" | "email" | "created_at">>(sqlQuery, [
      name,
      email,
      password,
    ]);
  return result.rows[0] ?? null;
};

const createUserWithBonus = async (
  name: string,
  email: string,
  password: string,
  bonusAmount: number,
): Promise<UserPublic> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");

    const userSqlQuery = `
      INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at;
    `;
    const userResult: QueryResult<UserPublic> = await client.query<UserPublic>(
      userSqlQuery,
      [name, email, password],
    );
    const newUser = userResult.rows[0];

    if (!newUser) {
      throw new Error("Failed to create user record");
    }

    const transactionSqlQuery = `
      INSERT INTO transactions (description, status) 
      VALUES ('Login Bank Bonus', 'COMPLETED')
      RETURNING id;
    `;
    const transactionResult: QueryResult<{ id: string }> = await client.query<{
      id: string;
    }>(transactionSqlQuery);
    const transactionRow = transactionResult.rows[0];

    if (!transactionRow) {
      throw new Error("Failed to create bonus transaction");
    }
    const transactionId = transactionRow.id;

    const bankResult: QueryResult<{ id: number }> = await client.query<{
      id: number;
    }>(`
        SELECT id FROM users WHERE email = 'bank@system.com';
      `);
    const bankRow = bankResult.rows[0];
    if (!bankRow) {
      throw new Error("Bank system user not found");
    }
    const bankUserId = bankRow.id;

    await client.query(
      `
        INSERT INTO ledger_entries (transaction_id, user_id, amount_in_cents)
        VALUES ($1, $2, $3);
      `,
      [transactionId, bankUserId, -bonusAmount],
    );

    await client.query(
      `
        INSERT INTO ledger_entries (transaction_id, user_id, amount_in_cents)
        VALUES ($1, $2, $3);
      `,
      [transactionId, newUser.id, bonusAmount],
    );

    await client.query("COMMIT");

    return newUser;
  } catch (e: unknown) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export { findUserByEmail, findUserById, createUser, createUserWithBonus };

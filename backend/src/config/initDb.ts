import pool from "./db.js";

const createInitialTables = async (): Promise<void> => {
  const SQL_QUERY = `
        -- 1. Sequences
        CREATE SEQUENCE IF NOT EXISTS users_id_seq
        START WITH 2300500;

        CREATE SEQUENCE IF NOT EXISTS ledger_id_seq
        START WITH 5300500;


        -- 2. Users
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER NOT NULL DEFAULT nextval('users_id_seq'),
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id)
        );


        -- 3. Transactions
        CREATE TABLE IF NOT EXISTS transactions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            idempotency_key VARCHAR(255) UNIQUE,
            description VARCHAR(200),
            status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


        -- 4. Ledger Entries
        CREATE TABLE IF NOT EXISTS ledger_entries (
            id INTEGER NOT NULL DEFAULT nextval('ledger_id_seq'),

            transaction_id UUID NOT NULL
                REFERENCES transactions(id)
                ON DELETE RESTRICT,

            user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE RESTRICT,

            amount_in_cents BIGINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id)
        );
    `;

  try {
    console.log("Creating intital tables");
    await pool.query(SQL_QUERY);
    console.log("Tables Created successfully");
  } catch (e: unknown) {
    console.error("Something wrong....", e instanceof Error ? e.message : e);
  } finally {
    await pool.end();
  }
};

void createInitialTables();

import pool from "./db.js";

const messagingDb = async () => {
  const SQL_QUERY = `

        CREATE SEQUENCE IF NOT EXISTS threads_id_seq
        START WITH 21000000;
        CREATE SEQUENCE IF NOT EXISTS message_id_seq
        START WITH 81000000;

        CREATE TABLE IF NOT EXISTS threads (
            id INTEGER PRIMARY KEY DEFAULT nextval('threads_id_seq'),
            is_group_chat BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS threads_participants (
            thread_id INTEGER REFERENCES threads(id),
            user_id INTEGER REFERENCES users(id),
            last_read_message_id INTEGER,
            PRIMARY KEY (thread_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY DEFAULT nextval('message_id_seq'),
            thread_id INTEGER NOT NULL REFERENCES threads(id),
            sender_id INTEGER NOT NULL REFERENCES users(id),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_messages_thread_id_id ON messages (thread_id, id DESC);
    `;

  try {
    await pool.query(SQL_QUERY);
    console.log("Messaging Tables created...");
  } catch (e) {
    console.log(e);
  } finally {
    await pool.end();
  }
};

messagingDb();

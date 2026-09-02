import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connection success");
});

pool.on("error", (err: Error) => {
  console.error("Something wrong on connection:", err.message);
  process.exit(-1);
});

export default pool;

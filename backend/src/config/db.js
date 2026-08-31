import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
    console.log("Connection success");
});

pool.on("error", () => {
    console.log("Something wrong on connection");
    process.exit(-1);
});

export default pool;
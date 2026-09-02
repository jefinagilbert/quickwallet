import pool from "./db.js";
import bcrypt from "bcrypt";

const seedBank = async (): Promise<void> => {
  try {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash("seedisthebest", salt);

    await pool.query(
      `
            INSERT INTO users (name, email, password) 
            VALUES ('System Bank', 'bank@system.com', $1)
            ON CONFLICT (email) DO NOTHING
        `,
      [hashedPassword],
    );

    console.log("Bank created Successfully");
  } catch (e: unknown) {
    console.error(
      "something wrong on creating Seed Bank",
      e instanceof Error ? e.message : e,
    );
  } finally {
    await pool.end();
  }
};

void seedBank();

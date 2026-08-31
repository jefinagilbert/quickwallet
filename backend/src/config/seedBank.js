import pool from "./db.js";
import bcrypt from "bcrypt";

const seedBank = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("seedisthebest", salt);

        await pool.query(`
            INSERT INTO users (name, email, password) 
            VALUES ('System Bank', 'bank@system.com', $1)
            ON CONFLICT (email) DO NOTHING
        `, [hashedPassword]);

        console.log("Bank created Successfully");

    } catch (e) {
        console.log("something wrong on creating Seed Bank", e.message);
    } finally {
        pool.end();
    }
}

seedBank();

import pool from "../../config/db.js";

const findUserByEmail = async (email) => {
    const sql_query = `
        SELECT * FROM users WHERE email=$1;
    `;
    const result = await pool.query(sql_query, [email]);
    return result.rows[0];
}

const createUser = async (name, email, password) => {
    const sql_query = `
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
        RETURNING name, email, created_at
    `;
    const result = await pool.query(sql_query, [name, email, password]);
    return result.rows[0];
}

const createUserWithBonus = async (name, email, password, bonusAmount) => {
    const client = await pool.connect();
    try {

        await client.query('BEGIN');

        const user_sql_query = `
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
        `;
        const user_result = await client.query(user_sql_query, [name, email, password]);
        const new_user = user_result.rows[0];

        const transaction_sql_query = `
            INSERT INTO transactions (description, status) 
            VALUES ('Login Bank Bonus', 'COMPLETED')
            RETURNING id
        `;
        const transaction_result = await client.query(transaction_sql_query);
        const transaction_id = transaction_result.rows[0].id;

        const bank_result = await client.query(`
            SELECT * FROM users WHERE email='bank@system.com'
        `);
        const bank_user_id = bank_result.rows[0].id;

        await client.query(`
            INSERT INTO ledger_entries (transaction_id, user_id, amount_in_cents)
            VALUES ($1, $2, $3)
        `, [transaction_id, bank_user_id, -bonusAmount]);

        await client.query(`
            INSERT INTO ledger_entries (transaction_id, user_id, amount_in_cents)
            VALUES ($1, $2, $3)
        `, [transaction_id, new_user.id, bonusAmount]);

        await client.query('COMMIT');

        return new_user;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

export {
    findUserByEmail,
    createUser,
    createUserWithBonus
};
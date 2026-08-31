import pool from "../src/config/db.js";
import request from "supertest";
import app from "../src/index.js";

beforeAll(async () => {
  // Ensure system bank exists for signup bonus transaction
  await pool.query(`
        INSERT INTO users (name, email, password) 
        VALUES ('System Bank', 'bank@system.com', 'seeded_bank_pass')
        ON CONFLICT (email) DO NOTHING
    `);
});

afterAll(async () => {
  await pool.end();
});

describe("Auth tests", () => {
  const uniqueEmail = `test_${Date.now()}@email.com`;
  const user = {
    name: "test user",
    email: uniqueEmail,
    password: "easypeasy",
  };

  it("Registering a user", async () => {
    const result = await request(app).post("/auth/signin").send(user);

    expect(result.status).toBe(201);
    expect(result.body.data.userDetails.email).toBe(uniqueEmail);
  });

  it("Log in a user", async () => {
    const result = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(result.status).toBe(202);
    expect(result.body.data.user.access_token).toBeDefined();
  });
});

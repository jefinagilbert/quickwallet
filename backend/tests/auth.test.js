import { jest } from "@jest/globals";
import bcrypt from "bcrypt";

// 1. Mock the repository module before importing app
const mockFindUserByEmail = jest.fn();
const mockCreateUserWithBonus = jest.fn();
const mockCreateUser = jest.fn();

jest.unstable_mockModule(
  "../src/repositories/auth/createUserRepository.js",
  () => ({
    findUserByEmail: mockFindUserByEmail,
    createUser: mockCreateUser,
    createUserWithBonus: mockCreateUserWithBonus,
  }),
);

// 2. Dynamically import app and supertest after mock is registered
const { default: app } = await import("../src/index.js");
const { default: request } = await import("supertest");

describe("Auth Tests (Mocked DB)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signin (Registration)", () => {
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      password: "securepassword123",
    };

    it("should successfully register a user and return 201", async () => {
      // Mock: No existing user found with this email
      mockFindUserByEmail.mockResolvedValue(null);

      // Mock: Successful creation in DB
      mockCreateUserWithBonus.mockResolvedValue({
        id: 2300501,
        name: newUser.name,
        email: newUser.email,
        created_at: new Date().toISOString(),
      });

      const response = await request(app).post("/auth/signin").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(201);
      expect(response.body.data.userDetails.email).toBe(newUser.email);
      expect(mockFindUserByEmail).toHaveBeenCalledWith(newUser.email);
      expect(mockCreateUserWithBonus).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if user with email already exists", async () => {
      // Mock: Existing user found
      mockFindUserByEmail.mockResolvedValue({
        id: 1,
        email: newUser.email,
      });

      const response = await request(app).post("/auth/signin").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "A user with this email already exists.",
      );
      expect(mockCreateUserWithBonus).not.toHaveBeenCalled();
    });
  });

  describe("POST /auth/login (Login)", () => {
    it("should successfully log in and return access token with 202", async () => {
      const rawPassword = "mypassword123";
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      mockFindUserByEmail.mockResolvedValue({
        id: 2300501,
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: rawPassword,
      });

      expect(response.status).toBe(202);
      expect(response.body.code).toBe(202);
      expect(response.body.data.user.access_token).toBeDefined();
      expect(response.body.data.user.email).toBe("test@example.com");
    });

    it("should return 401 if email does not exist", async () => {
      mockFindUserByEmail.mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("INVALID CREDENTIALS");
    });

    it("should return 401 if password is incorrect", async () => {
      const hashedPassword = await bcrypt.hash("correct_password", 10);

      mockFindUserByEmail.mockResolvedValue({
        id: 2300501,
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("INVALID CREDENTIALS");
    });
  });
});

import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import bcrypt from "bcrypt";
import type { Express } from "express";
import type {
  ApiErrorResponse,
  ApiResponse,
  LoginResponse,
  User,
  UserPublic,
} from "../src/types/index.js";

// 1. Mock the repository module before importing app
const mockFindUserByEmail = jest.fn<(email: string) => Promise<User | null>>();
const mockCreateUserWithBonus =
  jest.fn<
    (
      name: string,
      email: string,
      password: string,
      bonusAmount: number,
    ) => Promise<UserPublic>
  >();
const mockCreateUser =
  jest.fn<
    (
      name: string,
      email: string,
      password: string,
    ) => Promise<Pick<User, "name" | "email" | "created_at"> | null>
  >();

jest.unstable_mockModule("../src/repositories/auth/authRepository.js", () => ({
  findUserByEmail: mockFindUserByEmail,
  createUser: mockCreateUser,
  createUserWithBonus: mockCreateUserWithBonus,
}));

// 2. Dynamically import app and supertest after mock is registered
const { default: app } = (await import("../src/index.js")) as {
  default: Express;
};
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

      const body = response.body as ApiResponse<{ userDetails: UserPublic }>;

      expect(response.status).toBe(201);
      expect(body.code).toBe(201);
      expect(body.data.userDetails.email).toBe(newUser.email);
      expect(mockFindUserByEmail).toHaveBeenCalledWith(newUser.email);
      expect(mockCreateUserWithBonus).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if user with email already exists", async () => {
      // Mock: Existing user found
      mockFindUserByEmail.mockResolvedValue({
        id: 1,
        name: "Existing",
        email: newUser.email,
        created_at: new Date(),
      });

      const response = await request(app).post("/auth/signin").send(newUser);

      const body = response.body as ApiErrorResponse;

      expect(response.status).toBe(400);
      expect(body.error).toBe("A user with this email already exists.");
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
        created_at: new Date(),
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: rawPassword,
      });

      const body = response.body as ApiResponse<{ user: LoginResponse }>;

      expect(response.status).toBe(202);
      expect(body.code).toBe(202);
      expect(body.data.user.access_token).toBeDefined();
      expect(body.data.user.email).toBe("test@example.com");
    });

    it("should return 401 if email does not exist", async () => {
      mockFindUserByEmail.mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      const body = response.body as ApiErrorResponse;

      expect(response.status).toBe(401);
      expect(body.error).toBe("INVALID CREDENTIALS");
    });

    it("should return 401 if password is incorrect", async () => {
      const hashedPassword = await bcrypt.hash("correct_password", 10);

      mockFindUserByEmail.mockResolvedValue({
        id: 2300501,
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        created_at: new Date(),
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrong_password",
      });

      const body = response.body as ApiErrorResponse;

      expect(response.status).toBe(401);
      expect(body.error).toBe("INVALID CREDENTIALS");
    });
  });
});

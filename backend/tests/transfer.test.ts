import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";
import type { Express } from "express";
import { ERROR_MESSAGES, TRANSACTION_STATUS } from "../src/constants/index.js";
import {
  AppError,
  type ApiErrorResponse,
  type TransferResult,
} from "../src/types/index.js";

// 1. Mock transferRepository module before importing app
const mockTransferRepository =
  jest.fn<
    (
      senderId: number,
      receiverId: number,
      description: string,
      amount_in_cents: number,
    ) => Promise<TransferResult>
  >();

jest.unstable_mockModule(
  "../src/repositories/transfer/transferRepository.js",
  () => ({
    default: mockTransferRepository,
  }),
);

// 2. Dynamically import app and supertest after mock is registered
const { default: app } = (await import("../src/index.js")) as {
  default: Express;
};
const { default: request } = await import("supertest");

describe("Transfer Tests (Mocked DB)", () => {
  const secretKey = "test_jwt_access_token_secret_key_ci";
  let validToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN = secretKey;
    validToken = jwt.sign({ userId: 2300501 }, secretKey, { expiresIn: "5m" });
  });

  describe("POST /transfer/send-money", () => {
    it("should return 401 if authorization header is missing", async () => {
      const response = await request(app).post("/transfer/send-money").send({
        senderId: 2300501,
        receiverId: 2300502,
        description: "Rent payment",
        amount_in_cents: 5000,
      });

      const body = response.body as ApiErrorResponse;
      expect(response.status).toBe(401);
      expect(body.error).toBe(ERROR_MESSAGES.UNAUTHORIZED_USER);
    });

    it("should return 400 if senderId and receiverId are identical", async () => {
      const response = await request(app)
        .post("/transfer/send-money")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          senderId: 2300501,
          receiverId: 2300501,
          description: "Self transfer",
          amount_in_cents: 1000,
        });

      const body = response.body as ApiErrorResponse;
      expect(response.status).toBe(400);
      expect(body.error).toBe(ERROR_MESSAGES.SAME_USER);
      expect(mockTransferRepository).not.toHaveBeenCalled();
    });

    it("should return 400 if amount_in_cents is zero or negative", async () => {
      const response = await request(app)
        .post("/transfer/send-money")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          senderId: 2300501,
          receiverId: 2300502,
          description: "Invalid transfer",
          amount_in_cents: 0,
        });

      const body = response.body as ApiErrorResponse;
      expect(response.status).toBe(400);
      expect(body.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
      expect(mockTransferRepository).not.toHaveBeenCalled();
    });

    it("should successfully transfer money and return 200", async () => {
      mockTransferRepository.mockResolvedValue({
        code: 200,
        data: {
          transaction_status: TRANSACTION_STATUS.COMPLETED,
          transferred_amount: 5000,
        },
      });

      const response = await request(app)
        .post("/transfer/send-money")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          senderId: 2300501,
          receiverId: 2300502,
          description: "Dinner share",
          amount_in_cents: 5000,
        });

      const body = response.body as TransferResult;
      expect(response.status).toBe(200);
      expect(body.code).toBe(200);
      expect(body.data.transaction_status).toBe(TRANSACTION_STATUS.COMPLETED);
      expect(body.data.transferred_amount).toBe(5000);
      expect(mockTransferRepository).toHaveBeenCalledWith(
        2300501,
        2300502,
        "Dinner share",
        5000,
      );
    });

    it("should return 400 if sender has insufficient funds", async () => {
      mockTransferRepository.mockRejectedValue(
        new AppError(400, ERROR_MESSAGES.INSUFFICIENT_FUNDS),
      );

      const response = await request(app)
        .post("/transfer/send-money")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          senderId: 2300501,
          receiverId: 2300502,
          description: "Overdraft",
          amount_in_cents: 999999,
        });

      const body = response.body as ApiErrorResponse;
      expect(response.status).toBe(400);
      expect(body.error).toBe(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
    });

    it("should return 404 if sender or receiver account does not exist", async () => {
      mockTransferRepository.mockRejectedValue(
        new AppError(
          404,
          ERROR_MESSAGES.SENDER_OR_RECEIVER_ACCOUNT_DOES_NOT_EXIST,
        ),
      );

      const response = await request(app)
        .post("/transfer/send-money")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          senderId: 9999999,
          receiverId: 2300502,
          description: "To unknown",
          amount_in_cents: 1000,
        });

      const body = response.body as ApiErrorResponse;
      expect(response.status).toBe(404);
      expect(body.error).toBe(
        ERROR_MESSAGES.SENDER_OR_RECEIVER_ACCOUNT_DOES_NOT_EXIST,
      );
    });
  });
});

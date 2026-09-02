import type { TransactionStatus } from "../../constants/index.js";

// Database Entities
export interface Transaction {
  id: string;
  idempotency_key?: string | null;
  description: string | null;
  status: TransactionStatus;
  created_at: Date | string;
}

export interface LedgerEntry {
  id: number;
  transaction_id: string;
  user_id: number;
  amount_in_cents: number | bigint;
  created_at: Date | string;
}

// Request / Response DTOs
export interface TransferInput {
  senderId: number;
  receiverId: number;
  description: string;
  amount_in_cents: number;
}

export interface TransferResultData {
  transaction_status: TransactionStatus;
  transferred_amount: number;
}

export interface TransferResult {
  code: number;
  data: TransferResultData;
}

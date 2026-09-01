const TRANSACTION_STATUS = Object.freeze({
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
});

const ERROR_MESSAGES = Object.freeze({
  USER_EXISTS: "A user with this email already exists.",
  EMAIL_DOES_NOT_EXIST: "EMAIL DOES NOT EXIST",
  INVALID_CREDENTIALS: "INVALID CREDENTIALS",
  SAME_USER: "Same User Id",
  SENDER_OR_RECEIVER_ACCOUNT_DOES_NOT_EXIST:
    "Send or Receiver account does not exist",
  DUPLICATION_TRANSFER_DETECTED: "Duplication transfer detected",
  INCORRECT_PASSWORD: "Incorrect Password",
  INSUFFICIENT_FUNDS: "Insufficient funds in the wallet.",
  INVALID_AMOUNT: "Transfer amount must be greater than zero.",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  UNAUTHORIZED_USER: "Unauthorized: Token not found!",
  UNAUTHORIZED_INVALID_EXPIRED: "Unauthorized: Invalid/Expired",
});

export { TRANSACTION_STATUS, ERROR_MESSAGES };

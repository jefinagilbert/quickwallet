import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../../repositories/auth/authRepository.js";
import { ERROR_MESSAGES } from "../../constants/index.js";
import type { LoginResponse } from "../../types/auth/authTypes.js";
import { AppError } from "../../types/common/errorTypes.js";

const loginUserService = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    throw new AppError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new AppError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const secret = process.env.ACCESS_TOKEN;
  if (!secret) {
    throw new AppError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  const access_token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: "5m",
  });

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    access_token,
  };
};

export default loginUserService;

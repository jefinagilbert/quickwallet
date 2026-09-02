import { ERROR_MESSAGES } from "../../constants/index.js";
import {
  createUserWithBonus,
  findUserByEmail,
} from "../../repositories/auth/authRepository.js";
import bcrypt from "bcrypt";
import type { UserPublic } from "../../types/auth/authTypes.js";
import { AppError } from "../../types/common/errorTypes.js";

const createUserService = async (
  name: string,
  email: string,
  password: string,
): Promise<UserPublic> => {
  const emailCheck = await findUserByEmail(email);
  if (emailCheck) {
    throw new AppError(400, ERROR_MESSAGES.USER_EXISTS);
  }

  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const BONUS_AMOUNT_IN_CENTS = 1000;

  const result: UserPublic = await createUserWithBonus(
    name,
    email,
    hashedPassword,
    BONUS_AMOUNT_IN_CENTS,
  );
  return result;
};

export default createUserService;

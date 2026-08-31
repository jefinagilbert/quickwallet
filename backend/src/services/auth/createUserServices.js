import { ERROR_MESSAGES } from "../../constants/index.js";
import { createUserWithBonus, findUserByEmail } from "../../repositories/auth/createUserRepository.js";
import bcrypt from "bcrypt";

const createUserServices = async (name, email, password) => {

    const emailCheck = await findUserByEmail(email);
    if (emailCheck) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const BONUS_AMOUNT_IN_CENTS = 1000;

    const result = await createUserWithBonus(name, email, hashedPassword, BONUS_AMOUNT_IN_CENTS);
    return result;
}

export default createUserServices;
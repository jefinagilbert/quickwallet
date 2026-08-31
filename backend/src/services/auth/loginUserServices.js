import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../../repositories/auth/createUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/index.js";

const loginUserServices = async (email, password) => {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error(ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST);
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
        throw new Error(ERROR_MESSAGES.INCORRECT_PASSWORD);
    }

    const access_token = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "5m" }
    );

    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        access_token
    };

}

export default loginUserServices;
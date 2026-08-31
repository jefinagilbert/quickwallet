import { ERROR_MESSAGES } from "../../constants/index.js";
import loginUserServices from "../../services/auth/loginUserServices.js";

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUserServices(email, password);

        res.status(202).json({
            code: 202,
            data: {
                user: result
            }
        })
    } catch (e) {
        if (e.message == ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST || e.message == ERROR_MESSAGES.INCORRECT_PASSWORD) {
            return res.status(401).json({
                code: 401,
                error: ERROR_MESSAGES.INVALID_CREDENTIALS
            });
        }
        res.status(500).json({
            code: 500,
            error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
}

export default loginController;
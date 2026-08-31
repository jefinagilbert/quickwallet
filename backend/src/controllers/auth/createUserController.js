import { ERROR_MESSAGES } from "../../constants/index.js";
import createUserServices from "../../services/auth/createUserServices.js";

const createUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const result = await createUserServices(name, email, password);

        res.status(201).json({
            code: 201,
            data: {
                userDetails: result
            }
        });

    } catch (e) {
        if (e.message == ERROR_MESSAGES.USER_EXISTS) {
            return res.status(400).json({
                error: e.message
            });
        }
        res.status(500).json({
            error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

export default createUserController;
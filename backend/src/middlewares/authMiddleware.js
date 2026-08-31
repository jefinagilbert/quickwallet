import { ERROR_MESSAGES } from "../constants/index.js";
import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            code: 401,
            error: ERROR_MESSAGES.UNAUTHORIZED_USER
        });
    }

    const authToken = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(authToken, process.env.ACCESS_TOKEN);

        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({
            code: 401,
            error: ERROR_MESSAGES.UNAUTHORIZED_INVALID_EXPIRED
        })
    }
}

export { requireAuth };
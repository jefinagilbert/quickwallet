import { Router } from "express";
import createUserController from "../../controllers/auth/createUserController.js";
import loginUserController from "../../controllers/auth/loginUserController.js";
import refreshTokenController from "../../controllers/auth/refreshTokenController.js";
import logoutUserController from "../../controllers/auth/logoutUserController.js";
import { loginRateLimiter } from "../../middlewares/rateLimiter.js";

const authRouter: Router = Router();

// Creating a user / registration
authRouter.post("/signin", createUserController);

// Login user
authRouter.post("/login", loginRateLimiter, loginUserController);

// Refresh token
authRouter.post("/refresh", refreshTokenController);

// Logout user
authRouter.post("/logout", logoutUserController);

export default authRouter;

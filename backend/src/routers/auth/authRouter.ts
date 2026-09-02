import { Router } from "express";
import createUserController from "../../controllers/auth/createUserController.js";
import loginUserController from "../../controllers/auth/loginUserController.js";

const authRouter: Router = Router();

// Creating a user / registration
authRouter.post("/signin", createUserController);

// Login user
authRouter.post("/login", loginUserController);

export default authRouter;

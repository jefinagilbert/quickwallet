import express from "express";
import createUserController from "../../controllers/auth/createUserController.js";
import loginController from "../../controllers/auth/loginController.js";

const authRouter = express.Router();

// Creating a user / registration
authRouter.post("/signin", createUserController);

// Login user
authRouter.post("/login", loginController);

export default authRouter;

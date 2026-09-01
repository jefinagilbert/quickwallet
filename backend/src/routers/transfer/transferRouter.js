import express from "express";
import transferController from "../../controllers/transfer/transferController.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";

const transferRouter = express.Router();

// Send Money
transferRouter.post("/send-money", requireAuth, transferController);

export default transferRouter;

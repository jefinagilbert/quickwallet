import { Router } from "express";
import transferController from "../../controllers/transfer/transferController.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";

const transferRouter: Router = Router();

// Send Money
transferRouter.post("/send-money", requireAuth, transferController);

export default transferRouter;

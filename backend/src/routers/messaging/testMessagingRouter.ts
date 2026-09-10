import express from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import testMessagingController from "../../controllers/messaging/testMessagingController.js";

const router = express.Router();

router.post("/send", requireAuth, testMessagingController);

export default router;

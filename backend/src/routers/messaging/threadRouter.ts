import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import createThreadController from "../../controllers/messaging/createThreadController.js";
import getInboxController from "../../controllers/messaging/getInboxController.js";

const threadRouter = Router();

threadRouter.post("/create", requireAuth, createThreadController);
threadRouter.get("/inbox", requireAuth, getInboxController);

export default threadRouter;

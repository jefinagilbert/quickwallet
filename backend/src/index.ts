import express, { type Express } from "express";
import authRouter from "./routers/auth/authRouter.js";
import transferRouter from "./routers/transfer/transferRouter.js";
import { initSocket } from "./socket.js";
import http from "http";
import threadRouter from "./routers/messaging/threadRouter.js";

const app: Express = express();

const PORT: number | string = process.env.PORT || 3000;

app.set("trust proxy", 1);

const server = http.createServer(app);

initSocket(server);

app.use(express.json());

// Routers
app.use("/auth", authRouter);

// Transfer
app.use("/transfer", transferRouter);

// chat
app.use("/thread", threadRouter);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

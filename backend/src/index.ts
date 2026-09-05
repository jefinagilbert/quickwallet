import express, { type Express } from "express";
import authRouter from "./routers/auth/authRouter.js";
import transferRouter from "./routers/transfer/transferRouter.js";

const app: Express = express();

const PORT: number | string = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(express.json());

// Routers
app.use("/auth", authRouter);

// Transfer
app.use("/transfer", transferRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

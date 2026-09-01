import express from "express";
import authRouter from "./routers/auth/authRouter.js";
import transferRouter from "./routers/transfer/transferRouter.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routers
app.use("/auth", authRouter);

// Tranfer
app.use("/transfer", transferRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

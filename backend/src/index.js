import express from "express";
import authRouter from "./routers/auth/authRouter.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())

// Routers
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
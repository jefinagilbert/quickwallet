import { Request, Response } from "express";
import { getIo } from "../../socket.js";

const testMessagingController = async (req: Request, res: Response) => {
  const { content, receiverId } = req.body;

  const messagePayload = {
    timestamp: new Date(),
    content,
    status: "DELIVERED",
  };

  const io = getIo();
  io.to(`user_${receiverId}`).emit("recieve_message", messagePayload);
  res.status(200).json({ status: "success", data: messagePayload });
};

export default testMessagingController;

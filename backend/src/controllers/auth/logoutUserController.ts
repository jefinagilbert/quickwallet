import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { blacklistToken } from "../../services/auth/blacklistService.js";

const logoutUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        code: 401,
        message: "No token provided for logout",
      });
      return;
    }

    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const expiresInSeconds = decoded.exp - currentTimeInSeconds;

      if (expiresInSeconds > 0) {
        await blacklistToken(token, expiresInSeconds);
      }
    }
    res.status(200).json({
      code: 200,
      message: "Logged out successfully...",
    });
  } catch (e) {
    next(e);
  }
};

export default logoutUserController;

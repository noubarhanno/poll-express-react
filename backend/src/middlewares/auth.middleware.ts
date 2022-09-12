import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../controllers/auth.controller";
import { UserModel } from "../models/auth";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      const user = await UserModel.findOne({
        where: { email: decodedToken.email },
      });
      if (user) {
        return next();
      }
    }
  }
  return res.status(401).json({
    message: "Unauthorized",
    success: false,
    status: 401,
  });
};

export default verifyToken;

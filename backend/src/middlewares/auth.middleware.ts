import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../controllers/auth.controller";
import { Users } from "../models";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decodedToken = decodeToken(token);
    const { email } = decodedToken || {};
    if (decodedToken && email) {
      const user = await Users.findOne({
        where: { email: decodedToken.email },
      });
      if (user && email) {
        req.headers.email = decodedToken.email;
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

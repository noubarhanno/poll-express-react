import express from "express";
import { login, register, verifyToken } from "../controllers/auth.controller";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/register", register);

usersRouter.post("/login", login);

usersRouter.post("/verifyToken", verifyToken);

export default usersRouter;

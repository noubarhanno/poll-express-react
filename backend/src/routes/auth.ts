import express from "express";
import { login, register } from "../controllers/auth.controller";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/register", register);

usersRouter.post("/login", login);

export default usersRouter;

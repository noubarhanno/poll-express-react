import express from "express";
import { createPoll, getPolls } from "../controllers/polls.controller";

const pollsRouter = express.Router({ mergeParams: true });

pollsRouter.post("/create", createPoll);

pollsRouter.get("/", getPolls);

export default pollsRouter;

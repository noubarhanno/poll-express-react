import express from "express";
import { createVote } from "../controllers/votes.controller";

const votesRouter = express.Router({ mergeParams: true });

votesRouter.post("/create", createVote);

export default votesRouter;

import express from "express";
import { getDashboardPolls } from "../controllers/polls.controller";

const publicPollsRouter = express.Router({ mergeParams: true });

publicPollsRouter.get("/polls", getDashboardPolls);

export default publicPollsRouter;

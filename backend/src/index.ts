import express, { Express } from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.config";
import usersRouter from "./routes/auth";
import pollsRouter from "./routes/polls";
import verifyToken from "./middlewares/auth.middleware";
import votesRouter from "./routes/votes";
import { getDashboardPolls } from "./controllers/polls.controller";
import publicPollsRouter from "./routes/public";

dotenv.config();

/**
 * create express instance
 */
const app: Express = express();

/**
 * getting port from the environment
 */
const port = process.env.PORT || 4000;

/**
 * setting up server startup with db connection
 */
const startDbConnection = async (): Promise<void> => {
  try {
    await db.sync();
    console.log("Database connection successful");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

/**
 * allow cross origin requests
 */
app.use(
  cors({
    origin: "*",
  })
);

/**
 * use bodyparser to parse json and urlencoded request bodies
 */
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use("/api/auth", usersRouter);

app.use("/api/dashboard", publicPollsRouter);

app.use("/api/polls/", verifyToken, pollsRouter);

app.use("/api/votes", verifyToken, votesRouter);

startDbConnection();

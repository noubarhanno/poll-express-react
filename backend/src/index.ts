import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.config";
import usersRouter from "./routes/auth";

dotenv.config();

db.sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("have issue in database connection" + err);
  });

/**
 * create express instance
 */
const app: Express = express();

/**
 * getting port from the environment
 */
const port = process.env.PORT;

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

app.use("/auth", usersRouter);

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

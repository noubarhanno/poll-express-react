import { Sequelize } from "sequelize-typescript";
import { Polls, Users, Choices } from "../models";
import Votes from "../models/votes";

const db = new Sequelize({
  dialect: "sqlite",
  host: "localhost",
  storage: "./db.sqlite",
  models: [Choices, Polls, Users, Votes],
  logging: false,
  username: "root",
  password: "root",
});

export default db;

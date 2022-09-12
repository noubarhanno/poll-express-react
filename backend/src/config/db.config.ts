import { Sequelize } from "sequelize";

const db = new Sequelize("voting-app", "root", "root", {
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false,
});

export default db;

import {
  Sequelize
} from "sequelize";
import {
  Env
} from "../config/env-loader.js";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USERNAME,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
});

try {
	sequelize.authenticate();
	sequelize.sync().then(() => console.log("Database & tables created!"));
} catch (err) {
	console.error(err);
}


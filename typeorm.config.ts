import { resolve } from "path";
import { DataSource } from "typeorm";

import "dotenv/config";

const absolutePath = resolve(__dirname, "src", "infra", "database", "postgres");

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME + (process.env.NODE_ENV === "test" ? "_test" : ""),
  migrations: [resolve(absolutePath, "migrations", "*{.js,.ts}")],
  entities: [resolve(absolutePath, "schemas", "*{.js,.ts}")],
  synchronize: process.env.NODE_ENV !== "production",
});

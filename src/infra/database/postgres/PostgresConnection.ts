import { resolve } from "path";
import { singleton } from "tsyringe";
import { DataSource, EntityTarget, Repository } from "typeorm";

import { NotConnectedError } from "./errors";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

@singleton()
export class PostgresConnection {
  private dataSource: DataSource;

  public constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME + (NODE_ENV === "test" ? "_test" : ""),
      migrations: [resolve(__dirname, "migrations", "*.{js,ts}")],
      entities: [resolve(__dirname, "schemas", "*.{js,ts}")],
      synchronize: NODE_ENV !== "production",
    });
  }

  public async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) await this.dataSource.initialize();
    console.log(this.dataSource.isInitialized);
  }

  public async disconnect(): Promise<void> {
    if (!this.dataSource.isInitialized) throw new NotConnectedError();
    await this.dataSource.destroy();
  }

  public getRepository<Entity>(entity: EntityTarget<Entity>): Repository<Entity> {
    console.log(this.dataSource.isInitialized);
    if (!this.dataSource.isInitialized) throw new NotConnectedError();
    return this.dataSource.getRepository(entity);
  }
}

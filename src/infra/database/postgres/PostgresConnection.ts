import { DataSource, EntityTarget, Repository } from "typeorm";

import dataSource from "../../../../typeorm.config";

import { NotConnectedError } from "./errors";

export class PostgresConnection {
  private static instance: PostgresConnection;

  public static getInstance() {
    if (this.instance == null) this.instance = new PostgresConnection(dataSource);
    return this.instance;
  }

  public constructor(private dataSource: DataSource) {}

  public async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) await this.dataSource.initialize();
  }

  public async disconnect(): Promise<void> {
    if (!this.dataSource.isInitialized) throw new NotConnectedError();
    await this.dataSource.destroy();
  }

  public getRepository<Entity>(entity: EntityTarget<Entity>): Repository<Entity> {
    if (!this.dataSource.isInitialized) throw new NotConnectedError();
    return this.dataSource.getRepository(entity);
  }
}

import { inject, singleton } from "tsyringe";
import { DataSource, EntityTarget, Repository } from "typeorm";

import { NotConnectedError } from "./errors";

@singleton()
export class PostgresConnection {
  public constructor(@inject("DataSource") private dataSource: DataSource) {}

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

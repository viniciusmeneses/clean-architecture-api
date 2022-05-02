import { PostgresConnection } from "./PostgresConnection";

export class Repository {
  public constructor(protected connection: PostgresConnection = PostgresConnection.getInstance()) {}
}

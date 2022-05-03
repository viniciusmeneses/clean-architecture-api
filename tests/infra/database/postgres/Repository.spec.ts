import { PostgresConnection } from "@infra/database/postgres";
import { Repository } from "@infra/database/postgres/Repository";

const makeSut = () => new Repository();

describe("Repository", () => {
  describe("connection", () => {
    test("Should be initialized with an instance of PostgresConnection", () => {
      const sut = makeSut();
      expect(sut["connection"]).toBeInstanceOf(PostgresConnection);
    });
  });
});

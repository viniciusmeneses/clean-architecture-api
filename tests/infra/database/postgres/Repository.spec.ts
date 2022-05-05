import { PostgresConnection, Repository } from "@infra/database/postgres";

const makeSut = () => new Repository();

describe("Repository", () => {
  describe("connection", () => {
    test("Should be initialized with an instance of PostgresConnection", () => {
      const sut = makeSut();
      expect(sut["connection"]).toBeInstanceOf(PostgresConnection);
    });
  });
});

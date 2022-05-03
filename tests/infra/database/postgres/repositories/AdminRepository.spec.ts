import { PostgresConnection } from "@infra/database/postgres";
import { AdminRepository } from "@infra/database/postgres/repositories/AdminRepository";
import { AdminSchema } from "@infra/database/postgres/schemas/AdminSchema";

import { fakeCreateAdminParams } from "../fakes/fakeAdmin";

const makeSut = () => new AdminRepository();

describe("AdminRepository", () => {
  let connection: PostgresConnection;

  beforeAll(async () => {
    connection = PostgresConnection.getInstance();
    await connection.connect();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  describe("create", () => {
    it("Should call Repository.save", async () => {
      const sut = makeSut();
      const { email, password } = fakeCreateAdminParams();

      const repository = connection.getRepository(AdminSchema);
      const saveSpy = jest.spyOn(repository, "save");

      await sut.create({ email, password });
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      const { email, password } = fakeCreateAdminParams();

      const repository = connection.getRepository(AdminSchema);
      jest.spyOn(repository, "save").mockRejectedValueOnce(new Error());

      await expect(sut.create({ email, password })).rejects.toThrow();
    });

    it("Should return an admin on success", async () => {
      const sut = makeSut();
      const { email, password } = fakeCreateAdminParams();
      const admin = await sut.create({ email, password });

      expect(admin).toMatchObject({ email, password });
      expect(admin.id).toBeTruthy();
    });
  });
});

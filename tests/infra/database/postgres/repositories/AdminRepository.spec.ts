import { Repository } from "typeorm";

import { Admin } from "@domain/entities/Admin";
import { PostgresConnection } from "@infra/database/postgres";
import { AdminRepository } from "@infra/database/postgres/repositories/AdminRepository";
import { AdminSchema } from "@infra/database/postgres/schemas/AdminSchema";
import { fakeAdminEntity } from "@tests/domain/fakes/fakeAdmin";

import { fakeCreateAdminParams } from "../fakes/fakeAdmin";

interface SutTypes {
  sut: AdminRepository;
  adminRepositoryMock: jest.Mocked<Repository<Admin>>;
}

PostgresConnection.prototype.getRepository = jest
  .fn()
  .mockReturnValue({ create: jest.fn(), save: jest.fn(), findOneBy: jest.fn() });

const makeAdminRepositoryMock = () => jest.mocked(PostgresConnection.getInstance().getRepository(AdminSchema));

const makeSut = (): SutTypes => {
  const sut = new AdminRepository();
  const adminRepositoryMock = makeAdminRepositoryMock();
  return { sut, adminRepositoryMock };
};

describe("AdminRepository", () => {
  describe("create", () => {
    it("Should call Repository.save", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const params = fakeCreateAdminParams();

      await sut.create(params);
      expect(adminRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const params = fakeCreateAdminParams();

      jest.spyOn(adminRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.create(params)).rejects.toThrow();
    });

    it("Should return an admin on success", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const admin = fakeAdminEntity();

      jest.spyOn(adminRepositoryMock, "save").mockResolvedValueOnce(admin);

      const createdAdmin = await sut.create({ email: admin.email, password: admin.password });
      expect(createdAdmin).toMatchObject(admin);
    });
  });

  describe("findByEmail", () => {
    it("Should call Repository.findOneBy", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const { email } = fakeAdminEntity();

      await sut.findByEmail(email);
      expect(adminRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOneBy throws", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const { email } = fakeAdminEntity();

      jest.spyOn(adminRepositoryMock, "findOneBy").mockRejectedValueOnce(new Error());
      await expect(sut.findByEmail(email)).rejects.toThrow();
    });

    it("Should return an admin if one exists with same email", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      const admin = fakeAdminEntity();

      jest.spyOn(adminRepositoryMock, "findOneBy").mockResolvedValueOnce(admin);

      const foundAdmin = await sut.findByEmail(admin.email);
      expect(foundAdmin).toMatchObject(admin);
    });

    it("Should not return an admin if none exists with same email", async () => {
      const { sut } = makeSut();
      const admin = fakeAdminEntity();

      const noneAdmin = await sut.findByEmail(admin.email);
      expect(noneAdmin).toBeFalsy();
    });
  });
});

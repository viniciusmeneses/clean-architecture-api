import { Repository } from "typeorm";

import { Admin } from "@domain/entities/Admin";
import { AdminRepository, PostgresConnection } from "@infra/database/postgres";
import { AdminSchema } from "@infra/database/postgres/schemas/AdminSchema";
import { makeFakeAdmin } from "@tests/domain/fakes/admin";

import { makeFakeCreateAdminInput } from "../fakes/admin";

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

const fakeAdmin = makeFakeAdmin();
const fakeCreateAdminInput = makeFakeCreateAdminInput();

describe("AdminRepository", () => {
  describe("create", () => {
    it("Should call Repository.save", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      await sut.create(fakeCreateAdminInput);
      expect(adminRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      jest.spyOn(adminRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.create(fakeCreateAdminInput)).rejects.toThrow();
    });

    it("Should return an admin on success", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      jest.spyOn(adminRepositoryMock, "save").mockResolvedValueOnce(fakeAdmin);
      const createdAdmin = await sut.create(fakeCreateAdminInput);
      expect(createdAdmin).toMatchObject(fakeAdmin);
    });
  });

  describe("findByEmail", () => {
    it("Should call Repository.findOneBy", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      await sut.findByEmail(fakeAdmin.email);
      expect(adminRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOneBy throws", async () => {
      const { sut, adminRepositoryMock } = makeSut();
      jest.spyOn(adminRepositoryMock, "findOneBy").mockRejectedValueOnce(new Error());
      await expect(sut.findByEmail(fakeAdmin.email)).rejects.toThrow();
    });

    it("Should return an admin if one exists with same email", async () => {
      const { sut, adminRepositoryMock } = makeSut();

      jest.spyOn(adminRepositoryMock, "findOneBy").mockResolvedValueOnce(fakeAdmin);
      const foundAdmin = await sut.findByEmail(fakeAdmin.email);

      expect(foundAdmin).toMatchObject(fakeAdmin);
    });

    it("Should not return an admin if none exists with same email", async () => {
      const { sut } = makeSut();
      const noneAdmin = await sut.findByEmail(fakeAdmin.email);
      expect(noneAdmin).toBeFalsy();
    });
  });
});

import { DataSource, Repository } from "typeorm";

import { PostgresConnection } from "@infra/database/postgres";
import { NotConnectedError } from "@infra/database/postgres/errors";

import dataSource from "../../../../typeorm.config";

jest.mock("../../../../typeorm.config", () => ({
  __esModule: true,
  default: {
    isInitialized: true,
    initialize: jest.fn(),
    destroy: jest.fn(),
    getRepository: jest.fn(() => new Repository(null, null)),
  },
}));

class DummyEntity {
  public id: string;
}

const dataSourceMock = dataSource as jest.Mocked<DataSource & { isInitialized: boolean }>;

const makeSut = () => PostgresConnection.getInstance();

describe("PostgresConnection", () => {
  beforeEach(() => {
    dataSourceMock.isInitialized = true;
  });

  describe("getInstance", () => {
    test("Should return the same instance", () => {
      const sut = makeSut();
      expect(sut).toBe(PostgresConnection.getInstance());
    });
  });

  describe("connect", () => {
    test("Should call DataSource.initialize", async () => {
      const sut = makeSut();
      dataSourceMock.isInitialized = false;
      await sut.connect();
      expect(dataSourceMock.initialize).toHaveBeenCalledTimes(1);
    });

    test("Should not call DataSource.initialize if DataSource.isInitialized is true", async () => {
      const sut = makeSut();
      await sut.connect();
      expect(dataSourceMock.initialize).toHaveBeenCalledTimes(0);
    });

    test("Should throw if DataSource.initialize throws", async () => {
      const sut = makeSut();
      jest.mocked(dataSourceMock.initialize).mockRejectedValue(new Error());
      await expect(sut.connect).rejects.toThrowError();
    });
  });

  describe("disconnect", () => {
    test("Should call DataSource.destroy", async () => {
      const sut = makeSut();
      await sut.disconnect();
      await expect(dataSourceMock.destroy).toHaveBeenCalledTimes(1);
    });

    test("Should throw NotConnectedError if DataSource.isInitialized is false", async () => {
      const sut = makeSut();
      dataSourceMock.isInitialized = false;
      await expect(sut.disconnect()).rejects.toThrowError(NotConnectedError);
    });

    test("Should throw if DataSource.destroy throws", async () => {
      const sut = makeSut();
      jest.mocked(dataSourceMock.destroy).mockRejectedValueOnce(new Error());
      await expect(sut.disconnect()).rejects.toThrowError();
    });
  });

  describe("getRepository", () => {
    test("Should return the repository instance on success", async () => {
      const sut = makeSut();
      const repository = sut.getRepository(DummyEntity);
      expect(repository).toBeInstanceOf(Repository);
    });

    test("Should throw NotConnectedError if DataSource.isInitialized is false", async () => {
      const sut = makeSut();
      dataSourceMock.isInitialized = false;
      expect(() => sut.getRepository(DummyEntity)).toThrowError(NotConnectedError);
    });

    test("Should call DataSource.getRepository with correct entity", async () => {
      const sut = makeSut();
      sut.getRepository(DummyEntity);
      expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
      expect(dataSourceMock.getRepository).toHaveBeenCalledWith(DummyEntity);
    });

    test("Should throw if DataSource.getRepository throws", async () => {
      const sut = makeSut();
      jest.mocked(dataSource.getRepository).mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() => sut.getRepository(DummyEntity)).toThrowError();
    });
  });
});

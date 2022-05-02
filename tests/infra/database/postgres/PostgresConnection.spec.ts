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
    test("Should getInstance return always the same instance", () => {
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

    test("Should not call to DataSource.initialize if DataSource is initialized", async () => {
      const sut = makeSut();
      await sut.connect();
      expect(dataSourceMock.initialize).toHaveBeenCalledTimes(0);
    });
  });

  describe("disconnect", () => {
    test("Should call DataSource.destroy", async () => {
      const sut = makeSut();
      await sut.disconnect();
      expect(dataSourceMock.destroy).toHaveBeenCalledTimes(1);
    });

    test("Should throw NotConnectedError if DataSource is not initialized", async () => {
      const sut = makeSut();
      dataSourceMock.isInitialized = false;
      await expect(sut.disconnect()).rejects.toThrowError(NotConnectedError);
    });
  });

  describe("getRepository", () => {
    test("Should return a repository instance on success", async () => {
      const sut = makeSut();
      const repository = sut.getRepository(DummyEntity);
      expect(repository).toBeInstanceOf(Repository);
    });

    test("Should throw NotConnectedError if DataSource is not initialized", async () => {
      const sut = makeSut();
      dataSourceMock.isInitialized = false;
      expect(() => sut.getRepository(DummyEntity)).toThrowError(NotConnectedError);
    });

    test("Should call DataSource.getRepository with entity", async () => {
      const sut = makeSut();
      sut.getRepository(DummyEntity);
      expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
      expect(dataSourceMock.getRepository).toHaveBeenCalledWith(DummyEntity);
    });
  });
});

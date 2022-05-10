import { DataSource, Repository } from "typeorm";

import { NotConnectedError, PostgresConnection } from "@infra/database/postgres";

interface SutTypes {
  sut: PostgresConnection;
  dataSourceMock: jest.Mocked<DataSource & { isInitialized: boolean }>;
}

jest.mock("typeorm", () => {
  const originalModule = jest.requireActual("typeorm");

  return {
    __esModule: true,
    ...originalModule,
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
      destroy: jest.fn(),
      getRepository: jest.fn(),
    })),
  };
});

class DummyEntity {
  public id: string;
}

const makeSut = (): SutTypes => {
  const sut = new PostgresConnection();
  const dataSourceMock = sut["dataSource"] as SutTypes["dataSourceMock"];
  dataSourceMock.isInitialized = true;
  return { sut, dataSourceMock };
};

describe("PostgresConnection", () => {
  describe("connect", () => {
    test("Should call DataSource.initialize", async () => {
      const { sut, dataSourceMock } = makeSut();
      dataSourceMock.isInitialized = false;
      await sut.connect();
      expect(dataSourceMock.initialize).toHaveBeenCalledTimes(1);
    });

    test("Should not call DataSource.initialize if DataSource.isInitialized is true", async () => {
      const { sut, dataSourceMock } = makeSut();
      await sut.connect();
      expect(dataSourceMock.initialize).toHaveBeenCalledTimes(0);
    });

    test("Should throw if DataSource.initialize throws", async () => {
      const { sut, dataSourceMock } = makeSut();
      jest.mocked(dataSourceMock.initialize).mockRejectedValue(new Error());
      await expect(sut.connect).rejects.toThrowError();
    });
  });

  describe("disconnect", () => {
    test("Should call DataSource.destroy", async () => {
      const { sut, dataSourceMock } = makeSut();
      await sut.disconnect();
      await expect(dataSourceMock.destroy).toHaveBeenCalledTimes(1);
    });

    test("Should throw NotConnectedError if DataSource.isInitialized is false", async () => {
      const { sut, dataSourceMock } = makeSut();
      dataSourceMock.isInitialized = false;
      await expect(sut.disconnect()).rejects.toThrowError(NotConnectedError);
    });

    test("Should throw if DataSource.destroy throws", async () => {
      const { sut, dataSourceMock } = makeSut();
      jest.mocked(dataSourceMock.destroy).mockRejectedValueOnce(new Error());
      await expect(sut.disconnect()).rejects.toThrowError();
    });
  });

  describe("getRepository", () => {
    test("Should return the repository instance on success", async () => {
      const { sut, dataSourceMock } = makeSut();
      dataSourceMock.getRepository.mockReturnValueOnce(new Repository(DummyEntity, null));
      const repository = sut.getRepository(DummyEntity);
      expect(repository).toBeInstanceOf(Repository);
    });

    test("Should throw NotConnectedError if DataSource.isInitialized is false", async () => {
      const { sut, dataSourceMock } = makeSut();
      dataSourceMock.isInitialized = false;
      expect(() => sut.getRepository(DummyEntity)).toThrowError(NotConnectedError);
    });

    test("Should call DataSource.getRepository with correct entity", async () => {
      const { sut, dataSourceMock } = makeSut();
      sut.getRepository(DummyEntity);
      expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
      expect(dataSourceMock.getRepository).toHaveBeenCalledWith(DummyEntity);
    });

    test("Should throw if DataSource.getRepository throws", async () => {
      const { sut, dataSourceMock } = makeSut();
      jest.mocked(dataSourceMock.getRepository).mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() => sut.getRepository(DummyEntity)).toThrowError();
    });
  });
});

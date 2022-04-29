import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository } from "@domain/ports/repositories/admin/CreateAdminRepository";
import { DbCreateAdminUseCase } from "@domain/useCases/admin/DbCreateAdminUseCase";
import { ValidationErrors } from "@domain/validator";
import { fakeAdminEntity, fakeCreateAdminParams } from "@tests/domain/fakes/fakeAdmin";

type MockedEncrypter = jest.Mocked<Encrypter>;
type MockedCreateAdminRepository = jest.Mocked<CreateAdminRepository>;

interface SutTypes {
  sut: DbCreateAdminUseCase;
  encrypterMock: MockedEncrypter;
  createAdminRepositoryMock: MockedCreateAdminRepository;
}

const createAdminParams = fakeCreateAdminParams();
const admin = fakeAdminEntity();

const makeEncrypterMock = () => {
  const encrypter: MockedEncrypter = { encrypt: jest.fn() };
  encrypter.encrypt.mockResolvedValue("hashedPassword");
  return encrypter;
};

const makeCreateAdminRepositoryMock = () => {
  const createAdminRepository: MockedCreateAdminRepository = { create: jest.fn() };
  createAdminRepository.create.mockResolvedValue(admin);
  return createAdminRepository;
};

const makeSut = (): SutTypes => {
  const encrypterMock = makeEncrypterMock();
  const createAdminRepositoryMock = makeCreateAdminRepositoryMock();
  const sut = new DbCreateAdminUseCase(encrypterMock, createAdminRepositoryMock);
  return { sut, encrypterMock, createAdminRepositoryMock };
};

describe("DbCreateAdmin UseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ email: "", password: "" });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call Encrypter.encrypt with password", async () => {
    const { sut, encrypterMock } = makeSut();
    await sut.execute(createAdminParams);

    expect(encrypterMock.encrypt).toBeCalledTimes(1);
    expect(encrypterMock.encrypt).toBeCalledWith(createAdminParams.password);
  });

  it("Should throw if Encrypter.encrypt throws", async () => {
    const { sut, encrypterMock } = makeSut();

    encrypterMock.encrypt.mockRejectedValueOnce(new Error());
    await expect(sut.execute(createAdminParams)).rejects.toThrowError(Error);
  });

  it("Should call CreateAdminRepository.create with correct data", async () => {
    const { sut, createAdminRepositoryMock } = makeSut();
    await sut.execute(createAdminParams);

    expect(createAdminRepositoryMock.create).toBeCalledTimes(1);
    expect(createAdminRepositoryMock.create).toBeCalledWith({ ...createAdminParams, password: "hashedPassword" });
  });

  it("Should throw if CreateAdminRepository.create throws", async () => {
    const { sut, createAdminRepositoryMock } = makeSut();
    createAdminRepositoryMock.create.mockRejectedValueOnce(new Error());
    await expect(sut.execute(createAdminParams)).rejects.toThrowError(Error);
  });

  it("Should return Result on success", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(createAdminParams);
    await expect(result).toMatchObject({ id: admin.id, email: admin.email });
  });
});

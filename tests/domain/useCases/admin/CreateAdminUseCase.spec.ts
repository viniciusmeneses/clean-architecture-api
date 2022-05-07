import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";
import { DbCreateAdminUseCase, EmailAlreadyExistsError } from "@domain/useCases/admin";
import { ValidationErrors } from "@domain/validator";
import { makeFakeAdmin, makeFakeCreateAdminInput } from "@tests/domain/fakes/admin";

type MockedEncrypter = jest.Mocked<Encrypter>;
type MockedAdminRepository = jest.Mocked<CreateAdminRepository & FindAdminByEmailRepository>;

interface SutTypes {
  sut: DbCreateAdminUseCase;
  encrypterMock: MockedEncrypter;
  adminRepositoryMock: MockedAdminRepository;
}

const fakeCreateAdminInput = makeFakeCreateAdminInput();
const fakeAdmin = makeFakeAdmin();

const makeEncrypterMock = () => {
  const encrypter: MockedEncrypter = { encrypt: jest.fn() };
  encrypter.encrypt.mockResolvedValue("hashedPassword");
  return encrypter;
};

const makeAdminRepositoryMock = () => {
  const adminRepository: MockedAdminRepository = { create: jest.fn(), findByEmail: jest.fn() };
  adminRepository.create.mockResolvedValue(fakeAdmin);
  return adminRepository;
};

const makeSut = (): SutTypes => {
  const encrypterMock = makeEncrypterMock();
  const adminRepositoryMock = makeAdminRepositoryMock();
  const sut = new DbCreateAdminUseCase(encrypterMock, adminRepositoryMock);
  return { sut, encrypterMock, adminRepositoryMock };
};

describe("CreateAdminUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ email: "", password: "" });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call AdminRepository.findByEmail with email", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    await sut.execute(fakeCreateAdminInput);

    expect(adminRepositoryMock.findByEmail).toBeCalledTimes(1);
    expect(adminRepositoryMock.findByEmail).toBeCalledWith(fakeCreateAdminInput.email);
  });

  it("Should throw if AdminRepository.findByEmail throws", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.findByEmail.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateAdminInput)).rejects.toThrow();
  });

  it("Should throw EmailAlreadyExistsError if already exists admin with same email", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.findByEmail.mockResolvedValue(makeFakeAdmin());
    await expect(sut.execute(fakeCreateAdminInput)).rejects.toThrowError(EmailAlreadyExistsError);
  });

  it("Should call Encrypter.encrypt with password", async () => {
    const { sut, encrypterMock } = makeSut();
    await sut.execute(fakeCreateAdminInput);

    expect(encrypterMock.encrypt).toBeCalledTimes(1);
    expect(encrypterMock.encrypt).toBeCalledWith(fakeCreateAdminInput.password);
  });

  it("Should throw if Encrypter.encrypt throws", async () => {
    const { sut, encrypterMock } = makeSut();

    encrypterMock.encrypt.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateAdminInput)).rejects.toThrow();
  });

  it("Should call AdminRepository.create with correct values", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    await sut.execute(fakeCreateAdminInput);

    expect(adminRepositoryMock.create).toBeCalledTimes(1);
    expect(adminRepositoryMock.create).toBeCalledWith({ ...fakeCreateAdminInput, password: "hashedPassword" });
  });

  it("Should throw if AdminRepository.create throws", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.create.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateAdminInput)).rejects.toThrow();
  });

  it("Should return admin entity on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(fakeCreateAdminInput);
    await expect(result).toMatchObject(fakeAdmin);
  });
});

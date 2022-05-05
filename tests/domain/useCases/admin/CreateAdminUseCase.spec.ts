import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";
import { DbCreateAdminUseCase, EmailAlreadyExistsError } from "@domain/useCases/admin";
import { ValidationError } from "@domain/validator";
import { fakeAdminEntity, fakeCreateAdminParams } from "@tests/domain/fakes/fakeAdmin";

type MockedEncrypter = jest.Mocked<Encrypter>;
type MockedAdminRepository = jest.Mocked<CreateAdminRepository & FindAdminByEmailRepository>;

interface SutTypes {
  sut: DbCreateAdminUseCase;
  encrypterMock: MockedEncrypter;
  adminRepositoryMock: MockedAdminRepository;
}

const createAdminParams = fakeCreateAdminParams();
const admin = fakeAdminEntity();

const makeEncrypterMock = () => {
  const encrypter: MockedEncrypter = { encrypt: jest.fn() };
  encrypter.encrypt.mockResolvedValue("hashedPassword");
  return encrypter;
};

const makeAdminRepositoryMock = () => {
  const adminRepository: MockedAdminRepository = { create: jest.fn(), findByEmail: jest.fn() };
  adminRepository.create.mockResolvedValue(admin);
  return adminRepository;
};

const makeSut = (): SutTypes => {
  const encrypterMock = makeEncrypterMock();
  const adminRepositoryMock = makeAdminRepositoryMock();
  const sut = new DbCreateAdminUseCase(encrypterMock, adminRepositoryMock);
  return { sut, encrypterMock, adminRepositoryMock };
};

describe("DbCreateAdminUseCase", () => {
  it("Should throw ValidationError if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ email: "", password: "" });
    await expect(promise).rejects.toThrowError(ValidationError);
  });

  it("Should call AdminRepository.findByEmail with email", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    await sut.execute(createAdminParams);

    expect(adminRepositoryMock.findByEmail).toBeCalledTimes(1);
    expect(adminRepositoryMock.findByEmail).toBeCalledWith(createAdminParams.email);
  });

  it("Should throw if AdminRepository.findByEmail throws", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.findByEmail.mockRejectedValueOnce(new Error());
    await expect(sut.execute(createAdminParams)).rejects.toThrow();
  });

  it("Should throw EmailAlreadyExistsError if already exists admin with same email", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.findByEmail.mockResolvedValue(fakeAdminEntity());
    await expect(sut.execute(createAdminParams)).rejects.toThrowError(EmailAlreadyExistsError);
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
    await expect(sut.execute(createAdminParams)).rejects.toThrow();
  });

  it("Should call AdminRepository.create with correct values", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    await sut.execute(createAdminParams);

    expect(adminRepositoryMock.create).toBeCalledTimes(1);
    expect(adminRepositoryMock.create).toBeCalledWith({ ...createAdminParams, password: "hashedPassword" });
  });

  it("Should throw if AdminRepository.create throws", async () => {
    const { sut, adminRepositoryMock } = makeSut();
    adminRepositoryMock.create.mockRejectedValueOnce(new Error());
    await expect(sut.execute(createAdminParams)).rejects.toThrow();
  });

  it("Should return admin data on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(createAdminParams);
    await expect(result).toMatchObject({ id: admin.id, email: admin.email });
  });
});

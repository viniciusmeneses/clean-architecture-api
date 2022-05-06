import { User } from "@domain/entities/User";
import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateUserRepository } from "@domain/ports/repositories/user/CreateUserRepository";
import { DbCreateUserUseCase } from "@domain/useCases/user/DbCreateUserUseCase";

interface SutTypes {
  sut: DbCreateUserUseCase;
  encrypterMock: jest.Mocked<Encrypter>;
  createUserRepositoryMock: jest.Mocked<CreateUserRepository>;
}

// mockar com faker depois
const user: User = {
  id: "kjasdjkasdkj",
  name: "Gabriel Gambôa",
  cpf: "44789525821",
  email: "gabrielgamboa10hotmail.com",
  password: "12345678",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const makeEncrypterMock = () => {
  const encrypter: jest.Mocked<Encrypter> = { encrypt: jest.fn() };
  encrypter.encrypt.mockResolvedValue("hashedPassword");
  return encrypter;
};

const makeCreateUserRepositoryMock = () => {
  const createAdminRepository: jest.Mocked<CreateUserRepository> = { create: jest.fn() };
  createAdminRepository.create.mockResolvedValue(user);
  return createAdminRepository;
};

const makeSut = (): SutTypes => {
  const encrypterMock = makeEncrypterMock();
  const createUserRepositoryMock = makeCreateUserRepositoryMock();
  const sut = new DbCreateUserUseCase(encrypterMock, createUserRepositoryMock);
  return { sut, encrypterMock, createUserRepositoryMock };
};

describe("DbCreateUser Use case", () => {
  it("should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    expect(async () => {
      await sut.execute({ email: "", password: "" });
    }).rejects.toThrow();
  });
});

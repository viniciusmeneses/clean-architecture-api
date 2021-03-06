import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import { AdminAlreadyExistsError } from "@domain/useCases/admin";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import { CreateAdminController } from "@presentation/controllers/admin";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeAdmin, makeFakeCreateAdminInput } from "@tests/domain/fakes";

type MockedCreateAdminUseCase = jest.Mocked<CreateAdminUseCase>;

interface SutTypes {
  sut: CreateAdminController;
  createAdminUseCaseMock: MockedCreateAdminUseCase;
}

const fakeAdmin = makeFakeAdmin();
const fakeRequest: CreateAdminController.Request = {
  body: makeFakeCreateAdminInput(),
};

const makeCreateAdminUseCaseMock = () => {
  const createAdminUseCase: MockedCreateAdminUseCase = { execute: jest.fn() };
  createAdminUseCase.execute.mockResolvedValue(fakeAdmin);
  return createAdminUseCase;
};

const makeSut = (): SutTypes => {
  const createAdminUseCaseMock = makeCreateAdminUseCaseMock();
  const sut = new CreateAdminController(createAdminUseCaseMock);
  return { sut, createAdminUseCaseMock };
};

describe("CreateAdminController", () => {
  it("Should call CreateAdminUseCase.execute with correct input", async () => {
    const { sut, createAdminUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(createAdminUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith(fakeRequest.body);
  });

  it("Should return bad request if CreateAdminUseCase.execute throws AdminAlreadyExistsError", async () => {
    const { sut, createAdminUseCaseMock } = makeSut();

    jest.spyOn(createAdminUseCaseMock, "execute").mockRejectedValueOnce(new AdminAlreadyExistsError(fakeAdmin.email));
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest([new AdminAlreadyExistsError(fakeAdmin.email)]));
  });

  it("Should return bad request if CreateAdminUseCase.execute throws ValidationErrors", async () => {
    const { sut, createAdminUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(createAdminUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if CreateAdminUseCase.execute throws uncaught error", async () => {
    const { sut, createAdminUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(createAdminUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });

  it("Should return created admin on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.created(fakeAdmin));
  });
});

import { validateOrReject, ValidationError as ClassValidationError } from "class-validator";

import { ValidationError } from "@domain/validator/errors";
import faker from "@faker-js/faker";

import { ValidateParams } from "../../../src/domain/validator";

import { DummyUseCase, DummyUseCaseInput } from "./dummies/dummyUseCase";

const makeSut = () => new DummyUseCase();

jest.mock("class-validator", () => {
  const originalModule = jest.requireActual("class-validator");

  return {
    ...originalModule,
    validateOrReject: jest.fn().mockResolvedValue(null),
  };
});

const fakeParams = { data: faker.random.word() };

describe("ValidateParams Decorator", () => {
  it("Should call ClassValidator.validateOrReject with correct input", async () => {
    const sut = makeSut();
    await sut.execute(fakeParams);

    expect(validateOrReject).toHaveBeenCalledTimes(1);
    expect(validateOrReject).toHaveBeenCalledWith(fakeParams, expect.anything());
  });

  it("Should throw ValidationError if ClassValidator.validateOrReject throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new ClassValidationError();

    jest
      .mocked(validateOrReject)
      .mockRejectedValueOnce([fakeValidatorError, { ...fakeValidatorError, constraints: { data: "error" } }]);
    const promise = sut.execute(fakeParams);

    await expect(promise).rejects.toEqual(new ValidationError(["error"]));
  });

  it("Should not validate undecorated params", async () => {
    class DummyUseCase {
      @ValidateParams
      public async execute(_input: DummyUseCaseInput): Promise<void> {
        return null;
      }
    }

    const sut = new DummyUseCase();
    const result = await sut.execute(fakeParams);

    expect(result).toBeNull();
    expect(validateOrReject).toHaveBeenCalledTimes(0);
  });
});

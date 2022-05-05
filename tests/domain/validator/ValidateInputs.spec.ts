import { validateOrReject, ValidationError as ClassValidationError } from "class-validator";

import { ValidationError } from "@domain/validator/errors";
import faker from "@faker-js/faker";

import { ValidateInputs } from "../../../src/domain/validator";

export class DummyUseCaseInput {
  public data: string;
}

export class DummyUseCase {
  @ValidateInputs
  public async execute(_input: DummyUseCaseInput): Promise<void> {
    return null;
  }
}

const makeSut = () => new DummyUseCase();

jest.mock("class-validator", () => {
  const originalModule = jest.requireActual("class-validator");

  return {
    ...originalModule,
    validateOrReject: jest.fn().mockResolvedValue(null),
  };
});

const fakeInput = { data: faker.random.word() };

describe("ValidateInputs Decorator", () => {
  it("Should call ClassValidator.validateOrReject with correct input", async () => {
    const sut = makeSut();
    await sut.execute(fakeInput);

    expect(validateOrReject).toHaveBeenCalledTimes(1);
    expect(validateOrReject).toHaveBeenCalledWith(fakeInput, expect.anything());
  });

  it("Should throw ValidationError if ClassValidator.validateOrReject throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new ClassValidationError();

    jest
      .mocked(validateOrReject)
      .mockRejectedValueOnce([fakeValidatorError, { ...fakeValidatorError, constraints: { data: "error" } }]);
    const promise = sut.execute(fakeInput);

    await expect(promise).rejects.toEqual(new ValidationError(["error"]));
  });

  it("Should not validate inputs that aren't a class", async () => {
    class DummyUseCase {
      @ValidateInputs
      public async execute(_input: string): Promise<void> {
        return null;
      }
    }

    const sut = new DummyUseCase();
    const result = await sut.execute(fakeInput.data);

    expect(result).toBeNull();
    expect(validateOrReject).toHaveBeenCalledTimes(0);
  });
});

import * as classValidator from "class-validator";

import { Param, ValidateParams, ValidationErrors } from "../../../src/domain/validator";

class UseCaseStubInput {
  public data: string;
}

class UseCaseStub {
  @ValidateParams
  public async execute(@Param _input: UseCaseStubInput): Promise<void> {
    return null;
  }
}

const makeSut = () => new UseCaseStub();

const validatorSpy = jest.spyOn(classValidator, "validateOrReject").mockResolvedValue(null);

describe("ValidateParams Decorator", () => {
  it("Should call validator with correct input", async () => {
    const sut = makeSut();
    await sut.execute({ data: "anyValue" });

    expect(validatorSpy).toHaveBeenCalledTimes(1);
    expect(validatorSpy).toHaveBeenCalledWith({ data: "anyValue" }, expect.anything());
  });

  it("Should throw ValidationErrors if validator throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new classValidator.ValidationError();

    validatorSpy.mockRejectedValueOnce([
      fakeValidatorError,
      { ...fakeValidatorError, constraints: { data: "errorMessage" } },
    ]);
    const promise = sut.execute({ data: "invalidValue" });

    await expect(promise).rejects.toEqual(new ValidationErrors(["errorMessage"]));
  });

  it("Should not validate undecorated params", async () => {
    class UseCaseStub {
      @ValidateParams
      public async execute(_input: UseCaseStubInput): Promise<void> {
        return null;
      }
    }

    const sut = new UseCaseStub();
    const result = await sut.execute({ data: "anyValue" });

    expect(result).toBeNull();
    expect(validatorSpy).toHaveBeenCalledTimes(0);
  });
});

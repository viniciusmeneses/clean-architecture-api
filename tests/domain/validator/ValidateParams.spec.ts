import * as classValidator from "class-validator";

import faker from "@faker-js/faker";

import { ValidateParams, ValidationErrors } from "../../../src/domain/validator";

import { UseCaseStub, UseCaseStubInput } from "./mocks/mockUseCase";

const makeSut = () => new UseCaseStub();

const validatorSpy = jest.spyOn(classValidator, "validateOrReject").mockResolvedValue(null);

const fakeParamData = { data: faker.random.word() };

describe("ValidateParams Decorator", () => {
  it("Should call validator with correct input", async () => {
    const sut = makeSut();
    await sut.execute(fakeParamData);

    expect(validatorSpy).toHaveBeenCalledTimes(1);
    expect(validatorSpy).toHaveBeenCalledWith(fakeParamData, expect.anything());
  });

  it("Should throw ValidationErrors if validator throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new classValidator.ValidationError();

    validatorSpy.mockRejectedValueOnce([fakeValidatorError, { ...fakeValidatorError, constraints: { data: "error" } }]);
    const promise = sut.execute(fakeParamData);

    await expect(promise).rejects.toEqual(new ValidationErrors(["error"]));
  });

  it("Should not validate undecorated params", async () => {
    class UseCaseStub {
      @ValidateParams
      public async execute(_input: UseCaseStubInput): Promise<void> {
        return null;
      }
    }

    const sut = new UseCaseStub();
    const result = await sut.execute(fakeParamData);

    expect(result).toBeNull();
    expect(validatorSpy).toHaveBeenCalledTimes(0);
  });
});

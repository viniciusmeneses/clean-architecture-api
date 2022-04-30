import { validateOrReject, ValidationError } from "class-validator";

import faker from "@faker-js/faker";

import { ValidateParams, ValidationErrors } from "../../../src/domain/validator";

import { UseCaseStub, UseCaseStubInput } from "./mocks/mockUseCase";

const makeSut = () => new UseCaseStub();

jest.mock("class-validator", () => {
  const originalModule = jest.requireActual("class-validator");

  return {
    ...originalModule,
    validateOrReject: jest.fn().mockResolvedValue(null),
  };
});

const fakeParams = { data: faker.random.word() };

describe("ValidateParams Decorator", () => {
  it("Should call validator with correct input", async () => {
    const sut = makeSut();
    await sut.execute(fakeParams);

    expect(validateOrReject).toHaveBeenCalledTimes(1);
    expect(validateOrReject).toHaveBeenCalledWith(fakeParams, expect.anything());
  });

  it("Should throw ValidationErrors if validator throws", async () => {
    const sut = makeSut();
    const fakeValidatorError = new ValidationError();

    jest
      .mocked(validateOrReject)
      .mockRejectedValueOnce([fakeValidatorError, { ...fakeValidatorError, constraints: { data: "error" } }]);
    const promise = sut.execute(fakeParams);

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
    const result = await sut.execute(fakeParams);

    expect(result).toBeNull();
    expect(validateOrReject).toHaveBeenCalledTimes(0);
  });
});

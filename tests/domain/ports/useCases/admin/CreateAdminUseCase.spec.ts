import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import faker from "@faker-js/faker";
import { fakeCreateAdminParams } from "@tests/domain/fakes/fakeAdmin";

import { validateSut } from "../../helpers/validateSut";

const makeSut = (data: object) => Object.assign(new CreateAdminUseCase.Params(), data);

describe("CreateAdminUseCaseParams", () => {
  describe("email", () => {
    it("Should throw if email is invalid", async () => {
      const sut = makeSut({ email: faker.random.word() });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "email" }]);
    });
  });

  describe("password", () => {
    it("Should throw if password length is less than 8", async () => {
      const sut = makeSut({ password: faker.internet.password(4) });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "password" }]);
    });

    it("Should throw if password doesn't contains at least one number", async () => {
      const sut = makeSut({ password: faker.internet.password(8, false, /[a-z]/) });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "password" }]);
    });
  });

  it("Should not throw if params are valid", async () => {
    const sut = makeSut(fakeCreateAdminParams());
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});

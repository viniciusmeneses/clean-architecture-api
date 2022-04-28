import { CreateAdminUseCase } from "@domain/ports/useCases/admin/CreateAdminUseCase";
import { faker } from "@faker-js/faker";

import { validateSut } from "../../helpers";

const makeSut = (data: object) => Object.assign(new CreateAdminUseCase.Params(), data);

describe("CreateAdmin UseCase Params", () => {
  it("Should throw if email is invalid", async () => {
    const sut = makeSut({ email: faker.random.word() });
    await expect(validateSut(sut)).rejects.toMatchObject([{ property: "email" }]);
  });

  it("Should throw if password length is less than 8", async () => {
    const sut = makeSut({ password: faker.internet.password(4) });
    await expect(validateSut(sut)).rejects.toMatchObject([{ property: "password" }]);
  });

  it("Should throw if password doesn't contains at least one number", async () => {
    const sut = makeSut({ password: faker.internet.password(8, false, /[a-z]/) });
    await expect(validateSut(sut)).rejects.toMatchObject([{ property: "password" }]);
  });

  it("Should not throw if params are valid", async () => {
    const sut = makeSut({ email: faker.internet.email(), password: faker.internet.password(8, false, /[a-z\d]/) });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});

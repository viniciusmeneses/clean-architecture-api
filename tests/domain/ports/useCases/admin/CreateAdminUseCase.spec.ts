import { CreateAdminUseCase } from "@domain/ports/useCases/admin/CreateAdminUseCase";

import { validateSut } from "../../helpers";

const makeSut = (data: object) => Object.assign(new CreateAdminUseCase.Params(), data);

describe("CreateAdmin UseCase Params", () => {
  it("Should throw if email is invalid", async () => {
    const sut = makeSut({ email: "invalidEmail" });
    const errors = await validateSut(sut);
    expect(errors[0]).toMatchObject({ property: "email" });
  });

  it("Should throw if password length is less than 8", async () => {
    const sut = makeSut({ password: "1234" });
    const errors = await validateSut(sut);
    expect(errors[0]).toMatchObject({ property: "password" });
  });

  it("Should throw if password doesn't contains at least one number", async () => {
    const sut = makeSut({ password: "invalidPassword" });
    const errors = await validateSut(sut);
    expect(errors[0]).toMatchObject({ property: "password" });
  });
});

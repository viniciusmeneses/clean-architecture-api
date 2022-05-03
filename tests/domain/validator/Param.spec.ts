import { DummyUseCase, DummyUseCaseInput } from "./dummies/dummyUseCase";

const makeSut = () => new DummyUseCase();

describe("Param Decorator", () => {
  it("Should set validator:params metadata mapping param index with class", async () => {
    const sut = makeSut();
    const metadata = Reflect.getMetadata("validator:params", sut, "execute");

    expect(metadata).toBeTruthy();
    expect(metadata).toMatchObject({ 0: DummyUseCaseInput });
  });
});

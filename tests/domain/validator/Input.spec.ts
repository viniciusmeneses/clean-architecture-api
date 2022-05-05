import { DummyUseCase, DummyUseCaseInput } from "./dummies/dummyUseCase";

const makeSut = () => new DummyUseCase();

describe("Input Decorator", () => {
  it("Should set validator:inputs metadata mapping param index with class", async () => {
    const sut = makeSut();
    const metadata = Reflect.getMetadata("validator:inputs", sut, "execute");

    expect(metadata).toBeTruthy();
    expect(metadata).toMatchObject({ 0: DummyUseCaseInput });
  });
});

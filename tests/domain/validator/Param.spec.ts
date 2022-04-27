import { UseCaseStub, UseCaseStubInput } from "./mocks/mockUseCase";

const makeSut = () => new UseCaseStub();

describe("Param Decorator", () => {
  it("Should set validator:params metadata with param index and class", async () => {
    const sut = makeSut();
    const metadata = Reflect.getMetadata("validator:params", sut, "execute");

    expect(metadata).toBeTruthy();
    expect(metadata).toMatchObject({ 0: UseCaseStubInput });
  });
});

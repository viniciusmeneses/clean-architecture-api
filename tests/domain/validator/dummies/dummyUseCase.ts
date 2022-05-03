import { Param, ValidateParams } from "@domain/validator";

export class DummyUseCaseInput {
  public data: string;
}

export class DummyUseCase {
  @ValidateParams
  public async execute(@Param _input: DummyUseCaseInput): Promise<void> {
    return null;
  }
}

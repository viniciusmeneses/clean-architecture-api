import { Input, ValidateInputs } from "@domain/validator";

export class DummyUseCaseInput {
  public data: string;
}

export class DummyUseCase {
  @ValidateInputs
  public async execute(@Input _input: DummyUseCaseInput): Promise<void> {
    return null;
  }
}

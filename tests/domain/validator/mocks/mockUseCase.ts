import { Param, ValidateParams } from "@domain/validator";

export class UseCaseStubInput {
  public data: string;
}

export class UseCaseStub {
  @ValidateParams
  public async execute(@Param _input: UseCaseStubInput): Promise<void> {
    return null;
  }
}

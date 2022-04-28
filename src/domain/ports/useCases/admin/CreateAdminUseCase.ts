import { IsEmail, Matches, MinLength } from "class-validator";

export interface CreateAdminUseCase {
  execute(data: CreateAdminUseCase.Params): CreateAdminUseCase.Result;
}

export namespace CreateAdminUseCase {
  export class Params {
    @IsEmail()
    public email: string;

    @MinLength(8)
    @Matches(/\d/)
    public password: string;
  }

  export type Result = Promise<void>;
}

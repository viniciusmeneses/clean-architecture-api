import { IsEmail, Matches, MinLength } from "class-validator";

export interface CreateUserUseCase {
  execute(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Result>;
}

export namespace CreateUserUseCase {
  export class Params {
    @IsEmail()
    public email: string;

    @MinLength(8)
    @Matches(/\d/)
    public password: string;
  }

  export interface Result {
    id: string;
    email: string;
    name: string;
  }
}

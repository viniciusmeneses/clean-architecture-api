import { IsEmail, Matches, MinLength } from "class-validator";

import { Admin } from "@domain/entities/Admin";

export interface CreateAdminUseCase {
  execute(data: CreateAdminUseCase.Input): Promise<CreateAdminUseCase.Result>;
}

export namespace CreateAdminUseCase {
  export class Input {
    @IsEmail()
    public email: string;

    @MinLength(8)
    @Matches(/\d/)
    public password: string;
  }

  export type Result = Admin;
}

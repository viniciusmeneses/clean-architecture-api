import { Admin } from "@domain/entities/Admin";

export interface CreateAdminRepository {
  create(data: CreateAdminRepository.Input): Promise<CreateAdminRepository.Result>;
}

export namespace CreateAdminRepository {
  export interface Input {
    email: string;
    password: string;
  }

  export type Result = Admin;
}

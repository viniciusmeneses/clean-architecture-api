import { Admin } from "@domain/entities/Admin";

export interface FindAdminByEmailRepository {
  findByEmail(email: string): Promise<FindAdminByEmailRepository.Result>;
}

export namespace FindAdminByEmailRepository {
  export type Result = Admin;
}

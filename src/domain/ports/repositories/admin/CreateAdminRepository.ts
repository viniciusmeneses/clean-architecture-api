import { Admin } from "@domain/entities/Admin";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin/CreateAdminUseCase";

export interface CreateAdminRepository {
  create(data: CreateAdminRepository.Params): Promise<CreateAdminRepository.Result>;
}

export namespace CreateAdminRepository {
  export type Params = CreateAdminUseCase.Params;
  export type Result = Admin;
}

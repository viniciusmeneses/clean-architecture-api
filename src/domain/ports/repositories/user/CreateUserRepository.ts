import { User } from "@domain/entities/User";
import { CreateUserUseCase } from "@domain/ports/useCases/user/CreateUserUseCase";

export interface CreateUserRepository {
  create(data: CreateAdminRepository.Params): Promise<CreateAdminRepository.Result>;
}

export namespace CreateAdminRepository {
  export type Params = CreateUserUseCase.Params;
  export type Result = User;
}

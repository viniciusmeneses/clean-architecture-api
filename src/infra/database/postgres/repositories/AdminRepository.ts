import { singleton } from "tsyringe";

import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";

import { Repository } from "../Repository";
import { AdminSchema } from "../schemas/AdminSchema";

@singleton()
export class AdminRepository extends Repository implements CreateAdminRepository, FindAdminByEmailRepository {
  public async create({ email, password }: CreateAdminRepository.Input): Promise<CreateAdminRepository.Result> {
    const repository = this.connection.getRepository(AdminSchema);
    const admin = repository.create({ email, password });
    return repository.save(admin);
  }

  public findByEmail(email: string): Promise<FindAdminByEmailRepository.Result> {
    const repository = this.connection.getRepository(AdminSchema);
    return repository.findOneBy({ email });
  }
}

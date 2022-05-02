import { Admin } from "@domain/entities/Admin";
import { CreateAdminRepository } from "@domain/ports/repositories/admin/CreateAdminRepository";

import { Repository } from "../Repository";
import { AdminSchema } from "../schemas/AdminSchema";

export class AdminRepository extends Repository implements CreateAdminRepository {
  public async create({ email, password }: CreateAdminRepository.Params): Promise<Admin> {
    const repository = this.connection.getRepository(AdminSchema);
    const admin = repository.create({ email, password });
    return repository.save(admin);
  }
}

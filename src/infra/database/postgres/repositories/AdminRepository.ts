import { Admin } from "@domain/entities/Admin";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";

import { Repository } from "../Repository";
import { AdminSchema } from "../schemas/AdminSchema";

export class AdminRepository extends Repository implements CreateAdminRepository, FindAdminByEmailRepository {
  public async create({ email, password }: CreateAdminRepository.Params): Promise<Admin> {
    const repository = this.connection.getRepository(AdminSchema);
    const admin = repository.create({ email, password });
    return repository.save(admin);
  }

  public findByEmail(email: string): Promise<Admin> {
    const repository = this.connection.getRepository(AdminSchema);
    return repository.findOneBy({ email });
  }
}

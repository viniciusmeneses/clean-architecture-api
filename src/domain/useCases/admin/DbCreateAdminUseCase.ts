import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import { Param, ValidateParams } from "@domain/validator";

import { EmailAlreadyExistsError } from "./errors";

export class DbCreateAdminUseCase implements CreateAdminUseCase {
  public constructor(
    private encrypter: Encrypter,
    private adminRepository: CreateAdminRepository & FindAdminByEmailRepository
  ) {}

  @ValidateParams
  public async execute(@Param data: CreateAdminUseCase.Params): Promise<CreateAdminUseCase.Result> {
    const existingAdmin = await this.adminRepository.findByEmail(data.email);
    if (existingAdmin) throw new EmailAlreadyExistsError(existingAdmin.email);

    const encryptedPassword = await this.encrypter.encrypt(data.password);
    const admin = await this.adminRepository.create({ ...data, password: encryptedPassword });
    return { id: admin.id, email: admin.email };
  }
}

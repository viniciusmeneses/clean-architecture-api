import { inject, singleton } from "tsyringe";

import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import { ValidateInputs } from "@domain/validator";

import { AdminAlreadyExistsError } from "./errors";

@singleton()
export class DbCreateAdminUseCase implements CreateAdminUseCase {
  public constructor(
    @inject("Encrypter") private encrypter: Encrypter,
    @inject("AdminRepository") private adminRepository: CreateAdminRepository & FindAdminByEmailRepository
  ) {}

  @ValidateInputs
  public async execute({ email, password }: CreateAdminUseCase.Input): Promise<CreateAdminUseCase.Result> {
    const existingAdmin = await this.adminRepository.findByEmail(email);
    if (existingAdmin) throw new AdminAlreadyExistsError(existingAdmin.email);

    const encryptedPassword = await this.encrypter.encrypt(password);
    return this.adminRepository.create({ email, password: encryptedPassword });
  }
}

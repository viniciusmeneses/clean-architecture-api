import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository } from "@domain/ports/repositories/admin/CreateAdminRepository";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin/CreateAdminUseCase";
import { Param, ValidateParams } from "@domain/validator";

export class DbCreateAdminUseCase implements CreateAdminUseCase {
  public constructor(private encrypter: Encrypter, private adminRepository: CreateAdminRepository) {}

  @ValidateParams
  public async execute(@Param data: CreateAdminUseCase.Params): Promise<CreateAdminUseCase.Result> {
    const encryptedPassword = await this.encrypter.encrypt(data.password);
    const admin = await this.adminRepository.create({ ...data, password: encryptedPassword });
    return { id: admin.id, email: admin.email };
  }
}

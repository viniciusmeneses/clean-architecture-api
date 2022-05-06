import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateUserRepository } from "@domain/ports/repositories/user/CreateUserRepository";
import { CreateUserUseCase } from "@domain/ports/useCases/user/CreateUserUseCase";
import { Param, ValidateParams } from "@domain/validator";

export class DbCreateUserUseCase implements CreateUserUseCase {
  public constructor(private encrypter: Encrypter, private userRepository: CreateUserRepository) {}

  @ValidateParams
  public async execute(@Param data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Result> {
    const encryptedPassword = await this.encrypter.encrypt(data.password);
    const user = await this.userRepository.create({ ...data, password: encryptedPassword });
    return { id: user.id, name: user.name, email: user.email };
  }
}

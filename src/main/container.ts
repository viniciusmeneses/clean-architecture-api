import { container } from "tsyringe";
import { DataSource } from "typeorm";

import { Encrypter } from "@domain/ports/crypt/Encrypter";
import { CreateAdminRepository, FindAdminByEmailRepository } from "@domain/ports/repositories/admin";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import { DbCreateAdminUseCase } from "@domain/useCases/admin";
import { BcryptAdapter } from "@infra/crypt/BcryptAdapter";
import { AdminRepository } from "@infra/database/postgres";

import dataSource from "../../typeorm.config";

container.registerInstance<DataSource>("DataSource", dataSource);

container.registerSingleton<CreateAdminRepository & FindAdminByEmailRepository>("AdminRepository", AdminRepository);

container.registerInstance<Encrypter>("Encrypter", new BcryptAdapter(12));

container.registerSingleton<CreateAdminUseCase>("CreateAdminUseCase", DbCreateAdminUseCase);

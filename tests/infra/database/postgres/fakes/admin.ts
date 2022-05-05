import { CreateAdminRepository } from "@domain/ports/repositories/admin/CreateAdminRepository";
import faker from "@faker-js/faker";

export const makeFakeCreateAdminInput = (): CreateAdminRepository.Input => ({
  email: faker.internet.email(),
  password: faker.internet.password(8) + faker.datatype.number(10),
});

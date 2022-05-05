import { Admin } from "@domain/entities/Admin";
import { CreateAdminUseCase } from "@domain/ports/useCases/admin/CreateAdminUseCase";
import faker from "@faker-js/faker";

export const fakeAdminEntity = (): Admin => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(64),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});

export const fakeCreateAdminParams = (): CreateAdminUseCase.Input => ({
  email: faker.internet.email(),
  password: faker.internet.password(8) + faker.datatype.number(10),
});

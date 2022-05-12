import request from "supertest";
import { container } from "tsyringe";
import { Repository } from "typeorm";

import { Admin } from "@domain/entities/Admin";
import { PostgresConnection } from "@infra/database/postgres";
import { AdminSchema } from "@infra/database/postgres/schemas/AdminSchema";
import { app } from "@main/app";
import { makeFakeCreateAdminInput } from "@tests/domain/fakes";

let connection: PostgresConnection;
let adminsRepository: Repository<Admin>;

describe("Admin Routes", () => {
  beforeAll(async () => {
    connection = container.resolve(PostgresConnection);
    await connection.connect();
    adminsRepository = connection.getRepository(AdminSchema);
  });

  beforeEach(() => adminsRepository.clear());
  afterAll(() => connection.disconnect());

  describe("POST /admins", () => {
    it("Should return 201 on create admin", async () => {
      const fakeData = makeFakeCreateAdminInput();
      const response = await request(app).post("/admins").send(fakeData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.email).toBe(fakeData.email);
      expect(response.body.password).toBeTruthy();
    });

    it("Should return 400 if any request param is invalid", async () => {
      const response = await request(app).post("/admins").send({ email: "email", password: "pass" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "FieldValidationError",
            message: "email must be an email",
          },
          {
            message: "password must match /\\d/ regular expression",
            type: "FieldValidationError",
          },
          {
            message: "password must be longer than or equal to 8 characters",
            type: "FieldValidationError",
          },
        ],
      });
    });

    it("Should return 400 if email already exists", async () => {
      const fakeData = makeFakeCreateAdminInput();

      await adminsRepository.insert(fakeData);
      const response = await request(app).post("/admins").send(fakeData);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            type: "EmailAlreadyExistsError",
            message: `Admin already exists with email ${fakeData.email}`,
          },
        ],
      });
    });
  });
});

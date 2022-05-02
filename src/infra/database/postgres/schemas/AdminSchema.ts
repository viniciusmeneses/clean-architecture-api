import { EntitySchema } from "typeorm";

import { Admin } from "@domain/entities/Admin";

export const AdminSchema = new EntitySchema<Admin>({
  name: "admins",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true,
      nullable: false,
    },
  },
});

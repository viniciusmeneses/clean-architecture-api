import { Router } from "express";
import { container } from "tsyringe";

import { ExpressAdapter } from "@main/adapters/ExpressAdapter";
import { CreateAdminController } from "@presentation/controllers/admin";

const adminRoutes = Router();

adminRoutes.post("/", ExpressAdapter.route(container.resolve(CreateAdminController)));

export { adminRoutes };

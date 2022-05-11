import { Router } from "express";

import { adminRoutes } from "./adminRoutes";

const routes = Router();

routes.use("/admins", adminRoutes);

export { routes };

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(routes);

export { app };

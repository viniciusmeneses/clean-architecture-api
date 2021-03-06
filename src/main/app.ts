import "express-async-errors";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandlerMiddleware, loggerMiddleware } from "./middlewares";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(loggerMiddleware);

app.use(routes);

app.use(errorHandlerMiddleware);

export { app };

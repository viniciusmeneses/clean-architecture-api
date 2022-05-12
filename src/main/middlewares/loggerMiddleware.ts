import { RequestHandler } from "express";
import log4js from "log4js";

const logger = log4js.getLogger();

export const loggerMiddleware: RequestHandler = log4js.connectLogger(logger, {
  level: "auto",
  format: (req, _, format) =>
    format(
      `:method :url :status :response-timems ${
        Object.keys(req.body).length > 0 ? `- body: ${JSON.stringify(req.body)}` : ""
      }`
    ),
});

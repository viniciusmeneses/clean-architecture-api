import { RequestHandler } from "express";
import log4js from "log4js";

log4js.configure({
  appenders: {
    console: { type: "console", layout: { type: "pattern", pattern: "%[[%p] | %d{yyyy/MM/dd hh:mm:ss O}]%] %m" } },
  },
  categories: { default: { appenders: ["console"], level: "info" } },
});

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

import { RequestHandler } from "express";

import { Controller } from "@presentation/protocols";

export class ExpressAdapter {
  public static route(controller: Controller): RequestHandler {
    return async (req, res) => {
      const { body, params, query } = req;
      const response = await controller.handle({ body, url: { params, query } });
      res.status(response.status).json(response.body);
    };
  }

  public static middleware(controller: Controller): RequestHandler {
    return async (req, res, next) => {
      const { body, params, query } = req;
      const response = await controller.handle({ body, url: { params, query } });
      if (response.status < 400) {
        Object.assign(req, response.body);
        next();
      } else {
        res.status(response.status).json(response.body);
      }
    };
  }
}

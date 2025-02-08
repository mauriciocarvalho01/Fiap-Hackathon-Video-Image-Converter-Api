import { Middleware } from '@/application/middlewares';

import { RequestHandler } from 'express';

type Adapter = (middleware: Middleware) => RequestHandler;
type AdapterHealthcheck = () => RequestHandler;

export const adaptExpressMiddleware: Adapter =
  (middleware) => async (req, res, next) => {
    const ip = req.ip?.replace(/.*:(\d+\.\d+\.\d+\.\d+)$/, '$1');
    const { statusCode, data } = await middleware.handle({
      ...req.headers,
      ip,
    });
    if (statusCode === 200 || statusCode === 201) {
      req.params.user = data;
      next();
    } else {
      try {
        res.status(statusCode).json({ errors: JSON.parse(data.message) });
      } catch (error) {
        res.status(statusCode).json({ errors: data.message });
      }
    }
  };

export const adaptExpressHealthcheckRoute: AdapterHealthcheck =
  () => async (_, res) => {
    const json = { ok: true };
    res.status(200).json(json);
  };

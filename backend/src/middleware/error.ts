import { type Request, type Response, type NextFunction } from 'express';
import pino from 'pino';
import type { ApiError } from '../utils/helpers.js';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error({
    err,
    method: req.method,
    url: req.url,
    body: req.body,
  });

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: (err as unknown as { errors: unknown }).errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const statusCode = (err as unknown as ApiError).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
}

export { logger };
import { type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { getConfig } from '../config/index.js';

export function createRateLimiter() {
  const config = getConfig();
  
  return rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many requests, please try again later',
    },
  });
}

export const apiRateLimiter = createRateLimiter();
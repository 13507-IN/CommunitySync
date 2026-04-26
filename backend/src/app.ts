import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { type Request, type Response, type NextFunction } from 'express';
import pinoHttp from 'pino-http';
import { logger, errorHandler, notFoundHandler } from './middleware/index.js';
import { apiRateLimiter } from './middleware/index.js';
import authRouter from './modules/auth/router.js';
import reportsRouter from './modules/reports/router.js';
import tasksRouter from './modules/tasks/router.js';
import governmentRouter from './modules/government/router.js';
import verificationRouter from './modules/verification/router.js';
import notificationsRouter from './modules/notifications/router.js';
import usersRouter from './modules/users/router.js';
import matchingRouter from './modules/matching/router.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3001,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
}));

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CommunitySync API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/gov', governmentRouter);
app.use('/api/verify', verificationRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/matching', matchingRouter);

app.use(apiRateLimiter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

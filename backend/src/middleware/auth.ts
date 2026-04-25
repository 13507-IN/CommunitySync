import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import type { AuthenticatedRequest } from '../types/index.js';
import { getDb } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    const db = getDb();
    const userResult = await db.select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = userResult[0];
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is disabled',
      });
    }

    (req as AuthenticatedRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
import { type Request, type Response, type NextFunction } from 'express';
import type { UserRole } from '../types/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const userRole = authenticatedReq.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}
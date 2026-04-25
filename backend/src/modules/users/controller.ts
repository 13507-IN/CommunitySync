import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as userService from './service.js';
import type { UpdateProfileInput } from './schemas.js';

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  
  const user = await userService.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
  });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const input = req.body as UpdateProfileInput;
  
  const user = await userService.updateProfile(userId, input);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
    message: 'Profile updated successfully',
  });
}
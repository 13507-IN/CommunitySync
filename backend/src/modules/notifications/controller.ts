import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as notificationService from './service.js';
import type { NotificationFilters } from './schemas.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const query = req.query as unknown as NotificationFilters;
  
  const result = await notificationService.getUserNotifications(userId, query);
  
  res.json({
    success: true,
    data: result.data,
    pagination: {
      page: query.page || 1,
      limit: query.limit || 10,
      total: result.total,
      totalPages: Math.ceil(result.total / (query.limit || 10)),
    },
  });
}

export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  
  const notification = await notificationService.markAsRead(id, userId);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found',
    });
  }

  res.json({
    success: true,
    message: 'Notification marked as read',
  });
}

export async function markAllRead(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  
  await notificationService.markAllAsRead(userId);
  
  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
}

export async function getUnreadCount(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  
  const count = await notificationService.getUnreadCount(userId);
  
  res.json({
    success: true,
    data: { count, unreadCount: count },
  });
}
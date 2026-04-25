import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as taskService from './service.js';
import type { AssignTaskInput, UpdateTaskStatusInput, TaskFilters } from './schemas.js';

export async function assignTask(req: AuthenticatedRequest, res: Response) {
  const input = req.body as AssignTaskInput;
  
  const task = await taskService.assignTask(input);
  
  res.status(201).json({
    success: true,
    data: task,
    message: 'Task assigned successfully',
  });
}

export async function getUserTasks(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const query = req.query as unknown as TaskFilters;
  
  const result = await taskService.getUserTasks(userId, query);
  
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

export async function updateTaskStatus(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const input = req.body as UpdateTaskStatusInput;
  
  const task = await taskService.updateTaskStatus(id, input);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found',
    });
  }

  res.json({
    success: true,
    data: task,
    message: 'Task status updated successfully',
  });
}

export async function getTaskById(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  
  const task = await taskService.getTaskById(id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found',
    });
  }

  res.json({
    success: true,
    data: task,
  });
}
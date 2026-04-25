import { z } from 'zod';

export const assignTaskSchema = z.object({
  reportId: z.string().uuid(),
  volunteerId: z.string().uuid(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'verified', 'closed']),
});

export const taskFiltersSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'verified', 'closed']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
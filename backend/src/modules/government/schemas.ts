import { z } from 'zod';

export const governmentActionSchema = z.object({
  reportId: z.string().uuid(),
  department: z.string().min(2),
  actionType: z.enum(['accept', 'in_progress', 'completed']),
  proofImageUrl: z.string().url().optional(),
  remarks: z.string().optional(),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'verified', 'closed', 'reopened']),
  remarks: z.string().optional(),
});

export const reportIdSchema = z.object({
  reportId: z.string().uuid(),
});

export type GovernmentActionInput = z.infer<typeof governmentActionSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
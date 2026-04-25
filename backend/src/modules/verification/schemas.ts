import { z } from 'zod';

export const verificationVoteSchema = z.object({
  reportId: z.string().uuid(),
  vote: z.enum(['approved', 'rejected']),
  comment: z.string().optional(),
});

export const verificationIdSchema = z.object({
  reportId: z.string().uuid(),
});

export type VerificationVoteInput = z.infer<typeof verificationVoteSchema>;
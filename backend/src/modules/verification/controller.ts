import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as verificationService from './service.js';
import type { VerificationVoteInput } from './schemas.js';

export async function submitVote(req: AuthenticatedRequest, res: Response) {
  const input = req.body as VerificationVoteInput;
  const userId = req.user!.userId;
  
  const hasVoted = await verificationService.hasUserVoted(input.reportId, userId);
  if (hasVoted) {
    return res.status(400).json({
      success: false,
      error: 'You have already voted on this report',
    });
  }
  
  const verification = await verificationService.submitVerification(input, userId);
  
  res.status(201).json({
    success: true,
    data: verification,
    message: 'Verification vote submitted successfully',
  });
}

export async function getReportVerifications(req: AuthenticatedRequest, res: Response) {
  const reportId = req.params.reportId as string;
  
  const verifications = await verificationService.getVerificationsByReportId(reportId);
  
  const approved = verifications.filter(v => v.vote === 'approved').length;
  const rejected = verifications.filter(v => v.vote === 'rejected').length;
  
  res.json({
    success: true,
    data: verifications,
    summary: {
      total: verifications.length,
      approved,
      rejected,
    },
  });
}
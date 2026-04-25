import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as governmentService from './service.js';
import type { GovernmentActionInput, UpdateReportStatusInput } from './schemas.js';

export async function createAction(req: AuthenticatedRequest, res: Response) {
  const input = req.body as GovernmentActionInput;
  const userId = req.user!.userId;
  
  const action = await governmentService.createGovernmentAction(input, userId);
  
  res.status(201).json({
    success: true,
    data: action,
    message: 'Government action recorded successfully',
  });
}

export async function getReportActions(req: AuthenticatedRequest, res: Response) {
  const reportId = req.params.reportId as string;
  
  const actions = await governmentService.getActionsByReportId(reportId);
  
  res.json({
    success: true,
    data: actions,
  });
}

export async function updateReportStatus(req: AuthenticatedRequest, res: Response) {
  const reportId = req.params.reportId as string;
  const input = req.body as UpdateReportStatusInput;
  
  const report = await governmentService.updateReportStatus(reportId, input);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Report not found',
    });
  }

  res.json({
    success: true,
    data: report,
    message: 'Report status updated successfully',
  });
}
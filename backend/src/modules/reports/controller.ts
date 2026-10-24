import { type Response } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import * as reportService from './service.js';
import type { CreateReportInput, UpdateReportInput, ReportFilters } from './schemas.js';

export async function createReport(req: AuthenticatedRequest, res: Response) {
  const input = req.body as CreateReportInput;
  const userId = req.user!.userId;
  
  const report = await reportService.createReport(input, userId);
  
  res.status(201).json({
    success: true,
    data: report,
    message: 'Report created successfully',
  });
}

export async function getReports(req: AuthenticatedRequest, res: Response) {
  const query = req.query as unknown as ReportFilters;
  
  const result = await reportService.getReports(query);
  
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

export async function getReportById(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  
  const report = await reportService.getReportById(id);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Report not found',
    });
  }

  res.json({
    success: true,
    data: report,
  });
}

export async function getMyReports(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const reports = await reportService.getReportsByUser(userId);

  res.json({
    success: true,
    data: reports,
  });
}

export async function updateReport(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const input = req.body as UpdateReportInput;
  
  const report = await reportService.updateReport(id, input);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Report not found',
    });
  }

  res.json({
    success: true,
    data: report,
    message: 'Report updated successfully',
  });
}

export async function deleteReport(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  
  await reportService.deleteReport(id);
  
  res.json({
    success: true,
    message: 'Report deleted successfully',
  });
}

export async function getNearbyReports(req: AuthenticatedRequest, res: Response) {
  const { lat, lng, radius } = req.query;
  
  const reports = await reportService.getNearbyReports(
    Number(lat),
    Number(lng),
    Number(radius) || 10
  );
  
  res.json({
    success: true,
    data: reports,
  });
}
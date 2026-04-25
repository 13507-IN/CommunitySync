import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { governmentActions, reports } from '../../db/schema/index.js';
import type { GovernmentAction } from '../../db/schema/government_actions.js';
import type { GovernmentActionInput, UpdateReportStatusInput } from './schemas.js';
import * as reportService from '../reports/service.js';

export async function createGovernmentAction(input: GovernmentActionInput, userId: string): Promise<GovernmentAction> {
  const db = getDb();
  
  const [action] = await db.insert(governmentActions)
    .values({
      reportId: input.reportId,
      department: input.department,
      actionType: input.actionType,
      proofImageUrl: input.proofImageUrl || null,
      remarks: input.remarks || null,
      performedBy: userId,
    })
    .returning();

  const statusMap: Record<string, string> = {
    accept: 'assigned',
    in_progress: 'in_progress',
    completed: 'completed',
  };

  await reportService.updateReport(input.reportId, {
    status: statusMap[input.actionType] as 'assigned' | 'in_progress' | 'completed',
  });

  return action;
}

export async function getActionsByReportId(reportId: string): Promise<GovernmentAction[]> {
  const db = getDb();
  
  const result = await db.select()
    .from(governmentActions)
    .where(eq(governmentActions.reportId, reportId))
    .orderBy(governmentActions.createdAt);

  return result;
}

export async function updateReportStatus(reportId: string, input: UpdateReportStatusInput): Promise<typeof reports.$inferSelect | null> {
  return reportService.updateReport(reportId, {
    status: input.status,
  });
}
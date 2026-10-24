import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { governmentActions, reports, users } from '../../db/schema/index.js';
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

export async function getActionsByReportId(reportId: string) {
  const db = getDb();
  
  const result = await db.select({
    id: governmentActions.id,
    reportId: governmentActions.reportId,
    department: governmentActions.department,
    actionType: governmentActions.actionType,
    proofImageUrl: governmentActions.proofImageUrl,
    remarks: governmentActions.remarks,
    performedBy: governmentActions.performedBy,
    performedByName: users.name,
    performedByRole: users.role,
    performedByEmail: users.email,
    createdAt: governmentActions.createdAt,
  })
    .from(governmentActions)
    .leftJoin(users, eq(governmentActions.performedBy, users.id))
    .where(eq(governmentActions.reportId, reportId))
    .orderBy(governmentActions.createdAt);

  return result;
}

export async function updateReportStatus(reportId: string, input: UpdateReportStatusInput): Promise<typeof reports.$inferSelect | null> {
  return reportService.updateReport(reportId, {
    status: input.status,
  });
}
import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { verifications, reports } from '../../db/schema/index.js';
import type { Verification } from '../../db/schema/verifications.js';
import type { VerificationVoteInput } from './schemas.js';
import * as reportService from '../reports/service.js';

const MAJORITY_THRESHOLD = 3;

export async function submitVerification(input: VerificationVoteInput, userId: string): Promise<Verification> {
  const db = getDb();
  
  const [verification] = await db.insert(verifications)
    .values({
      reportId: input.reportId,
      userId,
      vote: input.vote,
      comment: input.comment || null,
    })
    .returning();

  await checkAndUpdateReportStatus(input.reportId);

  return verification;
}

export async function getVerificationsByReportId(reportId: string): Promise<Verification[]> {
  const db = getDb();
  
  const result = await db.select()
    .from(verifications)
    .where(eq(verifications.reportId, reportId))
    .orderBy(verifications.createdAt);

  return result;
}

export async function hasUserVoted(reportId: string, userId: string): Promise<boolean> {
  const db = getDb();
  
  const result = await db.select()
    .from(verifications)
    .where(and(
      eq(verifications.reportId, reportId),
      eq(verifications.userId, userId)
    ))
    .limit(1);

  return result.length > 0;
}

export async function checkAndUpdateReportStatus(reportId: string): Promise<void> {
  const db = getDb();
  
  const allVerifications = await db.select()
    .from(verifications)
    .where(eq(verifications.reportId, reportId));

  const approved = allVerifications.filter(v => v.vote === 'approved').length;
  const rejected = allVerifications.filter(v => v.vote === 'rejected').length;
  const total = allVerifications.length;

  if (approved >= MAJORITY_THRESHOLD && approved > rejected) {
    await reportService.updateReport(reportId, { status: 'closed' });
  } else if (rejected >= MAJORITY_THRESHOLD && rejected > approved) {
    await reportService.updateReport(reportId, { status: 'reopened' });
  }
}
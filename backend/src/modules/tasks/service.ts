import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { tasks, reports } from '../../db/schema/index.js';
import type { Task } from '../../db/schema/tasks.js';
import type { AssignTaskInput, UpdateTaskStatusInput, TaskFilters } from './schemas.js';
import * as reportService from '../reports/service.js';

export async function assignTask(input: AssignTaskInput): Promise<Task> {
  const db = getDb();
  
  const [task] = await db.insert(tasks)
    .values({
      reportId: input.reportId,
      assignedTo: input.volunteerId,
      status: 'assigned',
    })
    .returning();

  await reportService.assignReportToVolunteer(input.reportId, input.volunteerId);

  return task;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const db = getDb();
  
  const result = await db.select()
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getUserTasks(userId: string, filters: TaskFilters): Promise<{ data: Task[]; total: number }> {
  const db = getDb();
  
  const conditions = [eq(tasks.assignedTo, userId)];
  
  if (filters.status) {
    conditions.push(eq(tasks.status, filters.status));
  }

  const whereClause = and(...conditions);
  
  const offset = (filters.page - 1) * filters.limit;
  
  const data = await db.select()
    .from(tasks)
    .where(whereClause)
    .orderBy(sql`${tasks.createdAt} DESC`)
    .limit(filters.limit)
    .offset(offset);

  const countResult = await db.select({ count: sql`count(*)` })
    .from(tasks)
    .where(whereClause);
  
  const total = Number(countResult[0]?.count || 0);

  return { data, total };
}

export async function updateTaskStatus(id: string, input: UpdateTaskStatusInput): Promise<Task | null> {
  const db = getDb();
  
  const updates: Partial<Task> = {
    status: input.status,
    updatedAt: new Date(),
  };

  if (input.status === 'in_progress' && !updates.startedAt) {
    updates.startedAt = new Date();
  }

  if (input.status === 'completed') {
    updates.completedAt = new Date();
  }

  if (input.status === 'verified') {
    updates.verifiedAt = new Date();
  }

  const [updated] = await db.update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  return updated || null;
}

export async function completeTask(id: string): Promise<Task | null> {
  return updateTaskStatus(id, { status: 'completed' });
}

export async function closeTask(id: string): Promise<Task | null> {
  return updateTaskStatus(id, { status: 'closed' });
}
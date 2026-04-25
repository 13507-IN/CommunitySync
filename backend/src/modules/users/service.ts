import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { users } from '../../db/schema/index.js';
import type { User } from '../../db/schema/users.js';
import type { UpdateProfileInput } from './schemas.js';

export async function getUserById(userId: string): Promise<User | null> {
  const db = getDb();
  
  const result = await db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<User | null> {
  const db = getDb();
  
  const [updated] = await db.update(users)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated || null;
}

export async function getUsersByRole(role: string): Promise<User[]> {
  const db = getDb();
  
  return db.select()
    .from(users)
    .where(eq(users.role, role as 'ngo' | 'volunteer' | 'govt' | 'admin'));
}
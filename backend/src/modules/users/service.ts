import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { users } from '../../db/schema/index.js';
import type { LocationData, User } from '../../db/schema/users.js';
import type { UpdateProfileInput } from './schemas.js';
import type { ProfileSetupInput } from '../auth/schemas.js';

const publicUserSelect = {
  id: users.id,
  clerkId: users.clerkId,
  name: users.name,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  role: users.role,
  skills: users.skills,
  locationData: users.locationData,
  phone: users.phone,
  avatarUrl: users.avatarUrl,
  isActive: users.isActive,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
} as const;

export async function getUserById(userId: string): Promise<User | null> {
  const db = getDb();
  
  const result = await db.select(publicUserSelect)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0]
    ? ({ ...result[0], location: null } as User)
    : null;
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const db = getDb();
  
  const result = await db.select(publicUserSelect)
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0]
    ? ({ ...result[0], location: null } as User)
    : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDb();
  
  const result = await db.select(publicUserSelect)
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0]
    ? ({ ...result[0], location: null } as User)
    : null;
}

export async function createOrUpdateClerkUser(input: ProfileSetupInput): Promise<User> {
  const db = getDb();
  
  // Check if user already exists
  const existingUser = await getUserByClerkId(input.clerkId);
  
  if (existingUser) {
    // Update existing user
    const [updated] = await db.update(users)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
        role: input.role,
        locationData: input.location as LocationData,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, input.clerkId))
      .returning();
    
    return updated;
  }

  const existingUserByEmail = await getUserByEmail(input.email);

  if (existingUserByEmail) {
    const [updated] = await db.update(users)
      .set({
        clerkId: input.clerkId,
        firstName: input.firstName,
        lastName: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
        role: input.role,
        locationData: input.location as LocationData,
        updatedAt: new Date(),
      })
      .where(eq(users.email, input.email))
      .returning();

    return updated;
  }
  
  // Create new user
  const [created] = await db.insert(users)
    .values({
      clerkId: input.clerkId,
      firstName: input.firstName,
      lastName: input.lastName,
      name: `${input.firstName} ${input.lastName}`,
      email: input.email,
      role: input.role,
      locationData: input.location as LocationData,
    })
    .returning();
  
  return created;
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
  
  const result = await db.select(publicUserSelect)
    .from(users)
    .where(eq(users.role, role as 'ngo' | 'volunteer' | 'govt' | 'admin'));

  return result.map((user) => ({ ...user, location: null } as User));
}

export async function getRecipientUsersByRole(role: string) {
  const db = getDb();
  
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
  })
    .from(users)
    .where(eq(users.role, role as 'ngo' | 'volunteer' | 'govt' | 'admin'));
}

export async function getAllUsers(): Promise<User[]> {
  const db = getDb();
  
  const result = await db.select(publicUserSelect)
    .from(users)
    .where(eq(users.isActive, true));

  return result.map((user) => ({ ...user, location: null } as User));
}

import { eq, and, desc, sql, or } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { reports, users } from '../../db/schema/index.js';
import type { Report } from '../../db/schema/reports.js';
import type { CreateReportInput, UpdateReportInput, ReportFilters } from './schemas.js';
import { analyzeIssueWithML } from '../../utils/ml.js';
import { createNotification } from '../notifications/service.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function createReport(input: CreateReportInput, userId: string): Promise<Report> {
  const db = getDb();
  
  // 1. Analyze issue with ML
  const mlAnalysis = await analyzeIssueWithML(input.title, input.description);

  // Convert lat,lng to PostGIS POINT
  let locationPoint: any = null;
  let latitude: number | null = null;
  let longitude: number | null = null;
  if (input.location) {
    [latitude, longitude] = input.location.split(',').map(Number);
    locationPoint = sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
  }

  let createdBy = userId;
  if (!uuidPattern.test(userId)) {
    const creator = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!creator[0]) {
      throw new Error('User profile not found. Complete profile setup before creating a report.');
    }

    createdBy = creator[0].id;
  }
  
  const [report] = await db.insert(reports)
    .values({
      title: input.title,
      description: input.description,
      category: input.category || mlAnalysis.category,
      urgency: input.urgency || mlAnalysis.urgency,
      location: locationPoint || input.location,
      latitude: parsedLat,
      longitude: parsedLng,
      address: input.address || null,
      latitude,
      longitude,
      images: input.images || [],
      createdBy,
      status: 'pending',
    })
    .returning();

  // 2. Notify nearby NGOs and Govt
  if (locationPoint) {
    const RADIUS_METERS = 10000; // 10km
    
    // Find NGOs and Govt users within 10km
    const nearbyUsers = await db.select()
      .from(users)
      .where(and(
        or(eq(users.role, 'ngo'), eq(users.role, 'govt')),
        sql`ST_DWithin(${users.location}, ${locationPoint}, ${RADIUS_METERS})`
      ));

    // Send notifications asynchronously
    Promise.all(nearbyUsers.map(u => 
      createNotification(
        u.id, 
        `New ${report.urgency} urgency ${report.category} issue reported nearby.`, 
        'system'
      )
    )).catch(err => console.error('Failed to send nearby notifications:', err));
  }

  return report;
}

export async function getReportById(id: string): Promise<Report | null> {
  const db = getDb();
  
  const result = await db.select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getReports(filters: ReportFilters): Promise<{ data: Report[]; total: number }> {
  const db = getDb();
  
  const conditions = [];
  
  if (filters.status) {
    conditions.push(eq(reports.status, filters.status));
  }
  
  if (filters.urgency) {
    conditions.push(eq(reports.urgency, filters.urgency));
  }
  
  if (filters.category) {
    const categoryValue = filters.category as 'infrastructure' | 'health' | 'environment' | 'safety' | 'education' | 'social' | 'other';
    conditions.push(eq(reports.category, categoryValue));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const offset = (filters.page - 1) * filters.limit;
  
  const data = await db.select({
    id: reports.id,
    title: reports.title,
    description: reports.description,
    category: reports.category,
    urgency: reports.urgency,
    status: reports.status,
    location: reports.location,
    latitude: reports.latitude,
    longitude: reports.longitude,
    address: reports.address,
    latitude: reports.latitude,
    longitude: reports.longitude,
    images: reports.images,
    createdBy: reports.createdBy,
    assignedTo: reports.assignedTo,
    urgencyScore: reports.urgencyScore,
    isPriority: reports.isPriority,
    createdAt: reports.createdAt,
    updatedAt: reports.updatedAt,
  })
    .from(reports)
    .where(whereClause)
    .orderBy(desc(reports.createdAt))
    .limit(filters.limit)
    .offset(offset);

  const countResult = await db.select({ count: sql`count(*)` })
    .from(reports)
    .where(whereClause);
  
  const total = Number(countResult[0]?.count || 0);

  return { data, total };
}

export async function updateReport(id: string, input: UpdateReportInput): Promise<Report | null> {
  const db = getDb();
  
  const [updated] = await db.update(reports)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(reports.id, id))
    .returning();

  return updated || null;
}

export async function deleteReport(id: string): Promise<boolean> {
  const db = getDb();
  
  await db.delete(reports)
    .where(eq(reports.id, id));

  return true;
}

export async function getNearbyReports(lat: number, lng: number, radiusKm: number = 10): Promise<Report[]> {
  const db = getDb();
  
  const radiusMeters = radiusKm * 1000;
  const point = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

  const nearbyReports = await db.select()
    .from(reports)
    .where(sql`ST_DWithin(${reports.location}, ${point}, ${radiusMeters})`)
    .orderBy(desc(reports.createdAt));

  return nearbyReports;
}

export async function assignReportToVolunteer(reportId: string, volunteerId: string): Promise<Report | null> {
  const db = getDb();
  
  const [updated] = await db.update(reports)
    .set({
      assignedTo: volunteerId,
      status: 'assigned',
      updatedAt: new Date(),
    })
    .where(eq(reports.id, reportId))
    .returning();

  return updated || null;
}

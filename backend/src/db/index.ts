import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { getConfig } from '../config/index.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

let initPromise: Promise<ReturnType<typeof drizzle>> | null = null;
let compatibilityPromise: Promise<void> | null = null;

async function runLegacySchemaCompatibility(pool: pg.Pool) {
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS location_data JSONB;
  `);

  await pool.query(`
    UPDATE users
    SET is_active = TRUE
    WHERE is_active IS NULL;
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_id_unique
    ON users (clerk_id)
    WHERE clerk_id IS NOT NULL;
  `);

  await pool.query(`
    ALTER TABLE reports
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS latitude REAL,
      ADD COLUMN IF NOT EXISTS longitude REAL,
      ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS urgency_score REAL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS is_priority BOOLEAN NOT NULL DEFAULT FALSE;
  `);

  await pool.query(`
    UPDATE reports
    SET
      urgency_score = COALESCE(urgency_score, 0),
      is_priority = COALESCE(is_priority, FALSE)
    WHERE urgency_score IS NULL
      OR is_priority IS NULL;
  `);
}

export async function ensureDatabaseCompatibility() {
  const currentPool = getPool();

  if (!compatibilityPromise) {
    compatibilityPromise = runLegacySchemaCompatibility(currentPool)
      .finally(() => {
        compatibilityPromise = null;
      });
  }

  return compatibilityPromise;
}

export async function initDatabase() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const config = getConfig();
    const isNeon = config.DATABASE_URL?.includes('neon.tech');

    pool = new Pool({
      connectionString: config.DATABASE_URL,
      ssl: isNeon ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    db = drizzle(pool);
    
    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });

    try {
      const client = await pool.connect();
      console.log('Database connection verified');
      client.release();

      await ensureDatabaseCompatibility();
      console.log('Database schema compatibility check completed');
    } catch (err) {
      console.error('Failed to connect to the database:', err);
      initPromise = null; // Allow retry
      throw err;
    }

    return db;
  })();

  return initPromise;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call await initDatabase() first.');
  }
  return db;
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.');
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}

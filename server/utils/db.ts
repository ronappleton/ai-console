import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';

let db: ReturnType<typeof drizzle> | null = null;
let queryClient: ReturnType<typeof postgres> | null = null;

/**
 * Get or create a singleton database connection
 * Uses environment variable DATABASE_URL for connection string
 */
export function useDB() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_console';
    
    // Create the postgres client
    queryClient = postgres(connectionString, {
      max: 10, // Maximum number of connections
    });
    
    // Create drizzle instance with schema
    db = drizzle(queryClient, { schema });
  }
  
  return db;
}

/**
 * Close the database connection
 * Useful for cleanup in tests or when shutting down
 */
export async function closeDB() {
  if (queryClient) {
    await queryClient.end();
    queryClient = null;
    db = null;
  }
}

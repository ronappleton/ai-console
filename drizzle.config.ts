import type { Config } from 'drizzle-kit';

export default {
  schema: './server/database/schema/*.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_console',
  },
} satisfies Config;

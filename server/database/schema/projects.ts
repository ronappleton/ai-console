import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Projects table - represents AI Console projects
 * 
 * Each project can contain multiple threads (chat sessions).
 * The memarch_project_id is used when communicating with the MemArch service.
 */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  memarchProjectId: text('memarch_project_id').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

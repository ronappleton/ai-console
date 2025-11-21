import { pgTable, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

/**
 * Threads table - represents chat threads/sessions within a project
 * 
 * Each thread belongs to a project and contains multiple messages.
 * The thread.id (UUID) is used as the thread_id throughout the system.
 * The memarchExternalRef follows the format: "<memarch_project_id>:thread:<thread_uuid>"
 * This external_ref is passed to MemArch when creating facts/events.
 */
export const threads = pgTable('threads', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New chat'),
  modeHint: text('mode_hint'), // e.g., 'chat', 'code', 'auto'
  memarchExternalRef: text('memarch_external_ref').notNull(),
  isArchived: boolean('is_archived').notNull().default(false),
  isPinned: boolean('is_pinned').notNull().default(false),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  projectIdLastMessageAtIdx: index('threads_project_id_last_message_at_idx').on(table.projectId, table.lastMessageAt.desc()),
  memarchExternalRefIdx: index('threads_memarch_external_ref_idx').on(table.memarchExternalRef),
}));

export type Thread = typeof threads.$inferSelect;
export type NewThread = typeof threads.$inferInsert;

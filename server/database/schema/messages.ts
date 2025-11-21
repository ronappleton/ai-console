import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';
import { threads } from './threads';

/**
 * Messages table - represents individual messages within a thread
 * 
 * Each message belongs to a thread and has a role (user, assistant, or system).
 * Messages are ordered chronologically by created_at.
 * The model_profile field stores which AI model was used (e.g., 'default-chat', 'deepseek-code-remote').
 */
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  threadId: uuid('thread_id').notNull().references(() => threads.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  content: text('content').notNull(),
  modelProfile: text('model_profile'), // e.g., 'default-chat', 'deepseek-code-remote'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  threadIdCreatedAtIdx: index('messages_thread_id_created_at_idx').on(table.threadId, table.createdAt),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

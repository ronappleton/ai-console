import { eq, asc } from 'drizzle-orm';
import { messages } from '~/server/database/schema';

/**
 * GET /api/messages/:threadId
 * Fetch all messages for a specific thread
 * Ordered by created_at ASC (chronological order)
 */
export default defineEventHandler(async (event) => {
  const db = useDB();
  const threadId = getRouterParam(event, 'threadId');
  
  if (!threadId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing threadId parameter',
    });
  }
  
  try {
    const threadMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(asc(messages.createdAt));
    
    return {
      success: true,
      data: threadMessages,
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages',
    });
  }
});

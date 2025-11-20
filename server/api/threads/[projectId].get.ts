import { eq, desc, sql } from 'drizzle-orm';
import { threads } from '../../database/schema';
import { useDB } from '../../utils/db';

/**
 * GET /api/threads/:projectId
 * List all threads for a specific project
 * Ordered by last_message_at DESC NULLS LAST (most recent first), then created_at DESC
 */
export default defineEventHandler(async (event) => {
  const db = useDB();
  const projectId = getRouterParam(event, 'projectId');
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing projectId parameter',
    });
  }
  
  try {
    const projectThreads = await db
      .select()
      .from(threads)
      .where(eq(threads.projectId, projectId))
      .orderBy(
        sql`${threads.lastMessageAt} DESC NULLS LAST`,
        desc(threads.createdAt)
      );
    
    return {
      success: true,
      data: projectThreads,
    };
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch threads',
    });
  }
});

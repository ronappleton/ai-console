import { eq } from 'drizzle-orm';
import { messages, threads, type NewMessage } from '../../database/schema';
import { useDB } from '../../utils/db';

/**
 * POST /api/messages
 * Create a new message in a thread
 * Also updates the thread's last_message_at timestamp
 * 
 * Body: {
 *   threadId: string (UUID),
 *   role: 'user' | 'assistant' | 'system',
 *   content: string,
 *   modelProfile?: string
 * }
 */
export default defineEventHandler(async (event) => {
  const db = useDB();
  const body = await readBody(event);
  
  // Validate required fields
  if (!body.threadId || !body.role || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: threadId, role, content',
    });
  }
  
  // Validate role
  if (!['user', 'assistant', 'system'].includes(body.role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid role. Must be one of: user, assistant, system',
    });
  }
  
  try {
    const newMessage: NewMessage = {
      threadId: body.threadId,
      role: body.role,
      content: body.content,
      modelProfile: body.modelProfile || null,
    };
    
    // Create the message and get the created timestamp
    const [createdMessage] = await db
      .insert(messages)
      .values(newMessage)
      .returning();
    
    // Update the thread's last_message_at and updated_at to match the message timestamp
    await db
      .update(threads)
      .set({ 
        lastMessageAt: createdMessage.createdAt,
        updatedAt: createdMessage.createdAt,
      })
      .where(eq(threads.id, body.threadId));
    
    return {
      success: true,
      data: createdMessage,
    };
  } catch (error: any) {
    console.error('Error creating message:', error);
    
    // Handle foreign key constraint violation
    // postgres.js wraps the error in a cause property
    const pgError = error.cause || error;
    if (pgError.code === '23503') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Thread not found',
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create message',
    });
  }
});

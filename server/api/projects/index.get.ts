import { asc } from 'drizzle-orm';
import { projects } from '../../database/schema';
import { useDB } from '../../utils/db';

/**
 * GET /api/projects
 * List all projects, sorted by name
 */
export default defineEventHandler(async () => {
  const db = useDB();
  
  try {
    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.name));
    
    return {
      success: true,
      data: allProjects,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects',
    });
  }
});

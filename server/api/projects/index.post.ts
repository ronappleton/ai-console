import { projects, type NewProject } from '../../database/schema';
import { useDB } from '../../utils/db';

/**
 * POST /api/projects
 * Create a new project
 * 
 * Body: {
 *   name: string,
 *   slug: string,
 *   memarchProjectId: string,
 *   description?: string,
 *   icon?: string,
 *   color?: string
 * }
 */
export default defineEventHandler(async (event) => {
  const db = useDB();
  const body = await readBody(event);
  
  // Validate required fields
  if (!body.name || !body.slug || !body.memarchProjectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, slug, memarchProjectId',
    });
  }
  
  try {
    const newProject: NewProject = {
      name: body.name,
      slug: body.slug,
      memarchProjectId: body.memarchProjectId,
      description: body.description || null,
      icon: body.icon || null,
      color: body.color || null,
    };
    
    const [createdProject] = await db
      .insert(projects)
      .values(newProject)
      .returning();
    
    return {
      success: true,
      data: createdProject,
    };
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Handle unique constraint violation for slug
    // postgres.js wraps the error in a cause property
    const pgError = error.cause || error;
    if (pgError.code === '23505' && pgError.constraint_name === 'projects_slug_unique') {
      throw createError({
        statusCode: 409,
        statusMessage: 'A project with this slug already exists',
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create project',
    });
  }
});

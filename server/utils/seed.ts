import { fileURLToPath } from 'node:url';
import { eq } from 'drizzle-orm';
import { useDB } from './db';
import { projects, threads, messages } from '../database/schema';

/**
 * Seed the database with sample data for development
 * This script creates sample projects, threads, and messages
 */
export async function seedDatabase() {
  const db = useDB();
  
  console.log('Seeding database...');
  
  try {
    // Create sample projects
    const [aiConsoleProject] = await db.insert(projects).values({
      name: 'AI Console',
      slug: 'ai-console',
      memarchProjectId: 'ai-console',
      description: 'Main AI Console project for development',
      icon: 'robot',
      color: '#3b82f6',
    }).returning();
    
    const [memarchProject] = await db.insert(projects).values({
      name: 'MemArch',
      slug: 'memarch',
      memarchProjectId: 'memarch',
      description: 'Memory architecture service',
      color: '#10b981',
    }).returning();
    
    console.log('✓ Created 2 projects');
    
    // Create sample threads for AI Console project
    const thread1Id = crypto.randomUUID();
    const [thread1] = await db.insert(threads).values({
      id: thread1Id,
      projectId: aiConsoleProject.id,
      title: 'Getting Started with AI',
      modeHint: 'chat',
      memarchExternalRef: `${aiConsoleProject.memarchProjectId}:thread:${thread1Id}`,
    }).returning();
    
    const thread2Id = crypto.randomUUID();
    const [thread2] = await db.insert(threads).values({
      id: thread2Id,
      projectId: aiConsoleProject.id,
      title: 'Code Review Session',
      modeHint: 'code',
      memarchExternalRef: `${aiConsoleProject.memarchProjectId}:thread:${thread2Id}`,
    }).returning();
    
    const thread3Id = crypto.randomUUID();
    await db.insert(threads).values({
      id: thread3Id,
      projectId: memarchProject.id,
      title: 'Architecture Discussion',
      memarchExternalRef: `${memarchProject.memarchProjectId}:thread:${thread3Id}`,
    }).returning();
    
    console.log('✓ Created 3 threads');
    
    // Create sample messages for thread 1
    const [msg1] = await db.insert(messages).values({
      threadId: thread1.id,
      role: 'user',
      content: 'Hello! Can you explain what the AI Console does?',
    }).returning();
    
    await db.insert(messages).values({
      threadId: thread1.id,
      role: 'assistant',
      content: 'The AI Console is a ChatGPT-like interface built with Nuxt 3 and Vue.js. It features project organization, chat history, and integrates with the MemArch memory service for persistent context across conversations.',
      modelProfile: 'default-chat',
    }).returning();
    
    await db.insert(messages).values({
      threadId: thread1.id,
      role: 'user',
      content: 'How does it integrate with MemArch?',
    }).returning();
    
    const [msg4] = await db.insert(messages).values({
      threadId: thread1.id,
      role: 'assistant',
      content: 'Each thread has a unique memarch_external_ref that follows the format "<memarch_project_id>:thread:<thread_uuid>". This allows MemArch to associate memories and facts with specific conversation threads.',
      modelProfile: 'default-chat',
    }).returning();
    
    // Update thread 1's last_message_at
    await db.update(threads).set({ 
      lastMessageAt: msg4.createdAt,
      updatedAt: msg4.createdAt,
    }).where(eq(threads.id, thread1.id));
    
    // Create sample messages for thread 2
    const [msg5] = await db.insert(messages).values({
      threadId: thread2.id,
      role: 'user',
      content: 'Can you review this TypeScript code for me?',
    }).returning();
    
    const [msg6] = await db.insert(messages).values({
      threadId: thread2.id,
      role: 'assistant',
      content: "I'd be happy to review your code! Please share the code you'd like me to review.",
      modelProfile: 'deepseek-code',
    }).returning();
    
    // Update thread 2's last_message_at
    await db.update(threads).set({ 
      lastMessageAt: msg6.createdAt,
      updatedAt: msg6.createdAt,
    }).where(eq(threads.id, thread2.id));
    
    console.log('✓ Created 6 messages');
    
    console.log('\nDatabase seeded successfully!');
    console.log('\nCreated:');
    console.log('  - 2 projects (AI Console, MemArch)');
    console.log('  - 3 threads (2 in AI Console, 1 in MemArch)');
    console.log('  - 6 messages (4 in thread 1, 2 in thread 2)');
    
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Allow running as a standalone script
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  seedDatabase()
    .then(() => {
      console.log('\nSeed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

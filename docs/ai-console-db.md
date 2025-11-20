# AI Console Database Documentation

## Overview

The AI Console has its own operational PostgreSQL database for storing UI state and chat data. This database is separate from the MemArch service and is used for fast loading of projects, threads, and messages in the UI.

## Architecture

### Database Stack

- **Database**: PostgreSQL 16+
- **ORM**: Drizzle ORM (TypeScript-first, lightweight)
- **Migrations**: Drizzle Kit
- **Driver**: postgres.js

### Entities

The database consists of three main entities:

#### 1. Projects (`projects` table)

Projects are top-level organizational units that can contain multiple chat threads.

**Fields:**
- `id` (UUID) - Primary key, auto-generated
- `name` (text) - Human-readable project name (e.g., "MemArch", "AI Console")
- `slug` (text) - URL-friendly unique identifier
- `memarch_project_id` (text) - The project_id used when communicating with MemArch service
- `description` (text, nullable) - Optional project description
- `icon` (text, nullable) - Icon identifier for UI
- `color` (text, nullable) - Color theme hint for UI
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

**Indexes:**
- Unique index on `slug`

#### 2. Threads (`threads` table)

Threads represent individual chat sessions within a project.

**Fields:**
- `id` (UUID) - Primary key, auto-generated, used as thread_id throughout the system
- `project_id` (UUID) - Foreign key to projects.id (cascade delete)
- `title` (text) - User-editable thread title, defaults to "New chat"
- `mode_hint` (text, nullable) - Mode indicator: 'chat', 'code', or 'auto'
- `memarch_external_ref` (text) - Canonical external reference for MemArch integration
- `is_archived` (boolean) - Archive status, defaults to false
- `is_pinned` (boolean) - Pin status for UI, defaults to false
- `last_message_at` (timestamp, nullable) - Timestamp of most recent message
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

**Indexes:**
- Index on `(project_id, last_message_at DESC)` - For efficient sidebar ordering
- Index on `memarch_external_ref` - For quick lookup

#### 3. Messages (`messages` table)

Messages are individual chat messages within a thread.

**Fields:**
- `id` (UUID) - Primary key, auto-generated
- `thread_id` (UUID) - Foreign key to threads.id (cascade delete)
- `role` (text enum) - Message role: 'user', 'assistant', or 'system'
- `content` (text) - Message content
- `model_profile` (text, nullable) - AI model identifier (e.g., 'default-chat', 'deepseek-code-remote')
- `created_at` (timestamp) - Creation timestamp

**Indexes:**
- Index on `(thread_id, created_at)` - For efficient chronological message retrieval

## MemArch Integration

The AI Console database is designed to work with the separate MemArch memory service:

### External Reference Format

For each thread, we construct a canonical external reference string:

```
Format: "<memarch_project_id>:thread:<thread_uuid>"
Example: "ai-console:thread:6f0da8d3-1234-5678-90ab-abcdef012345"
```

This format ensures:
1. **Uniqueness** across the entire system
2. **Traceability** back to the project and thread
3. **Consistency** in MemArch fact/event storage

### Data Flow

1. **Project Creation**: Store `memarch_project_id` to use in MemArch API calls
2. **Thread Creation**: 
   - Generate UUID for thread
   - Build `memarch_external_ref` using project's `memarch_project_id` and thread UUID
   - Store in database
3. **MemArch API Calls**: 
   - Pass `memarch_project_id` as the project context
   - Pass `memarch_external_ref` when creating facts/events
   - This allows MemArch to associate memories with specific threads

## API Endpoints

### Projects

#### `GET /api/projects`
List all projects, sorted by name.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Project",
      "slug": "my-project",
      "memarchProjectId": "my-project",
      "description": "...",
      "icon": "...",
      "color": "#3b82f6",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/projects`
Create a new project.

**Request Body:**
```json
{
  "name": "My Project",
  "slug": "my-project",
  "memarchProjectId": "my-project",
  "description": "Optional description",
  "icon": "optional-icon",
  "color": "#3b82f6"
}
```

### Threads

#### `GET /api/threads/:projectId`
List all threads for a project, ordered by most recent message.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "My Chat",
      "modeHint": "auto",
      "memarchExternalRef": "my-project:thread:uuid",
      "isArchived": false,
      "isPinned": false,
      "lastMessageAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/threads`
Create a new thread in a project.

**Request Body:**
```json
{
  "projectId": "uuid",
  "title": "New Chat",
  "modeHint": "auto"
}
```

### Messages

#### `GET /api/messages/:threadId`
Fetch all messages for a thread, in chronological order.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "threadId": "uuid",
      "role": "user",
      "content": "Hello!",
      "modelProfile": null,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "threadId": "uuid",
      "role": "assistant",
      "content": "Hi! How can I help?",
      "modelProfile": "default-chat",
      "createdAt": "2024-01-01T00:00:01Z"
    }
  ]
}
```

#### `POST /api/messages`
Create a new message in a thread.

**Request Body:**
```json
{
  "threadId": "uuid",
  "role": "user",
  "content": "Hello!",
  "modelProfile": "default-chat"
}
```

**Notes:**
- Automatically updates `threads.last_message_at`
- `modelProfile` is optional

## Database Setup

### Environment Configuration

Create a `.env` file (or set environment variables):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_console
```

### Running Migrations

```bash
# Generate new migrations (after schema changes)
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Docker Setup

The included Docker Compose configurations automatically set up PostgreSQL:

**Development:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Production:**
```bash
docker compose up -d
```

Both configurations include:
- PostgreSQL 16 Alpine container
- Automatic health checks
- Persistent volumes
- Network connectivity between services

### Initial Setup Steps

1. Start the database:
   ```bash
   docker compose -f docker-compose.dev.yml up -d postgres
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

## Development Workflow

### Adding New Fields

1. Update the schema in `server/database/schema/*.ts`
2. Generate migration: `npm run db:generate`
3. Review the generated SQL in `server/database/migrations/`
4. Run migration: `npm run db:migrate`

### Querying the Database

The database connection is available via `useDB()` in server routes:

```typescript
import { useDB } from '~/server/utils/db';
import { projects } from '~/server/database/schema';

export default defineEventHandler(async () => {
  const db = useDB();
  const allProjects = await db.select().from(projects);
  return allProjects;
});
```

### TypeScript Types

All tables have auto-generated TypeScript types:

```typescript
import type { Project, NewProject } from '~/server/database/schema/projects';
import type { Thread, NewThread } from '~/server/database/schema/threads';
import type { Message, NewMessage } from '~/server/database/schema/messages';
```

- Use `Project`, `Thread`, `Message` for selected/existing records
- Use `NewProject`, `NewThread`, `NewMessage` for inserts

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Update `updated_at`** when modifying records
3. **Use cascade deletes** appropriately (already configured)
4. **Index frequently queried fields** (already done for common queries)
5. **Validate input** in API handlers before database operations
6. **Handle unique constraint violations** gracefully (see project creation endpoint)

## Future Enhancements

Potential improvements to consider:

1. **Metadata/JSONB field** on messages for storing routing/debug info
2. **Full-text search** on message content
3. **Thread sharing/permissions** system
4. **Message edit history** tracking
5. **Thread templates** for common workflows
6. **Analytics/usage tracking** tables

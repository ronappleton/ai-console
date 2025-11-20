# AI Console

A ChatGPT-like interface built with Nuxt 3 and Vue.js. This application features a clean, modern interface with a sidebar for organizing projects and chat history.

## Features

- 🎨 ChatGPT-inspired interface design
- 📁 Collapsible project organization
- 💬 Chat interface with message history
- 🎯 Project-based chat management
- ⚙️ Settings button (UI ready for implementation)
- 📱 Responsive and modern design
- 🗄️ PostgreSQL database for persistent storage
- 🔗 MemArch integration ready

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Database

This project uses PostgreSQL with Drizzle ORM for data persistence. See [docs/ai-console-db.md](docs/ai-console-db.md) for detailed documentation.

### Quick Start

1. Copy the environment example:
   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL (via Docker Compose):
   ```bash
   docker compose -f docker-compose.dev.yml up -d postgres
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Database Commands

```bash
# Generate migrations after schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

This project includes Docker and Docker Compose configurations for both development and production environments.

### Production Mode

Build and run the application in production mode:

```bash
# Build and start the container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

The application will be available at `http://localhost:3000`.

> **Note:** If you encounter SSL certificate issues during the build, set the `NPM_STRICT_SSL` environment variable:
> ```bash
> NPM_STRICT_SSL=false docker compose up -d
> ```

### Development Mode

Run the application in development mode with hot reload:

```bash
# Build and start the development container
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop the container
docker compose -f docker-compose.dev.yml down
```

The development server will be available at `http://localhost:3000` with hot reload enabled.

> **Note:** If you encounter SSL certificate issues during the build, set the `NPM_STRICT_SSL` environment variable:
> ```bash
> NPM_STRICT_SSL=false docker compose -f docker-compose.dev.yml up -d
> ```

### Docker Commands Reference

```bash
# Build production image
docker build -t ai-console:prod .

# Build production image (with SSL certificate issue workaround)
docker build --build-arg NPM_STRICT_SSL=false -t ai-console:prod .

# Build development image
docker build -f Dockerfile.dev -t ai-console:dev .

# Build development image (with SSL certificate issue workaround)
docker build --build-arg NPM_STRICT_SSL=false -f Dockerfile.dev -t ai-console:dev .

# Run production container
docker run -p 3000:3000 ai-console:prod

# Run development container with volume mounts
docker run -p 3000:3000 -v $(pwd)/app:/app/app -v $(pwd)/public:/app/public ai-console:dev
```

# Dockerfile for production build
# Multi-stage build for optimized image size

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Note: If you encounter SSL certificate issues during build, add --build-arg NPM_STRICT_SSL=false
ARG NPM_STRICT_SSL=true
RUN if [ "$NPM_STRICT_SSL" = "false" ]; then npm config set strict-ssl false; fi && npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Set environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]

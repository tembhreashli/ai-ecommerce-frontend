# Frontend Docker Guide

This guide covers running the AI E-Commerce frontend application using Docker and Docker Compose.

## Table of Contents

- [Overview](#overview)
- [Docker Setup](#docker-setup)
- [Development with Docker](#development-with-docker)
- [Production Deployment](#production-deployment)
- [Docker Compose](#docker-compose)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Overview

We provide two Docker configurations:

1. **Development Dockerfile** (`Dockerfile`)
   - Node.js 18 Alpine base
   - Hot module replacement (HMR)
   - Volume mounts for live code updates
   - Port 5173 exposed

2. **Production Dockerfile** (`Dockerfile.prod`)
   - Multi-stage build
   - Nginx Alpine for serving
   - Optimized static files
   - Security headers
   - Port 80 exposed

## Docker Setup

### Prerequisites

Install Docker and Docker Compose:

- **Docker Desktop** (includes Compose): [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Docker Engine** (Linux): [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Development with Docker

### Option 1: Using Docker CLI

#### Build Development Image

```bash
docker build -t ai-ecommerce-frontend:dev .
```

Or use the npm script:
```bash
npm run docker:build
```

#### Run Development Container

Basic run:
```bash
docker run -p 5173:5173 ai-ecommerce-frontend:dev
```

With environment variables:
```bash
docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=http://host.docker.internal:8080/api \
  -e VITE_DEBUG=true \
  ai-ecommerce-frontend:dev
```

With volume mount for live reload:
```bash
docker run -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -v /app/node_modules \
  ai-ecommerce-frontend:dev
```

#### Access the Application

Open your browser to: **http://localhost:5173**

### Option 2: Using Docker Compose

#### Frontend Only

Run just the frontend:
```bash
docker-compose -f docker-compose.frontend.yml up
```

Run in detached mode:
```bash
docker-compose -f docker-compose.frontend.yml up -d
```

View logs:
```bash
docker-compose -f docker-compose.frontend.yml logs -f
```

Stop services:
```bash
docker-compose -f docker-compose.frontend.yml down
```

#### Full Stack (Backend + Frontend + Services)

Run entire stack:
```bash
docker-compose -f docker-compose.full.yml up
```

This starts:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- RabbitMQ (ports 5672, 15672)
- Backend API (port 8080)
- Frontend app (port 5173)

Run in detached mode:
```bash
docker-compose -f docker-compose.full.yml up -d
```

Check service status:
```bash
docker-compose -f docker-compose.full.yml ps
```

View all logs:
```bash
docker-compose -f docker-compose.full.yml logs -f
```

View specific service logs:
```bash
docker-compose -f docker-compose.full.yml logs -f frontend
docker-compose -f docker-compose.full.yml logs -f backend
```

Stop all services:
```bash
docker-compose -f docker-compose.full.yml down
```

Remove volumes (clean slate):
```bash
docker-compose -f docker-compose.full.yml down -v
```

## Production Deployment

### Build Production Image

Using Docker CLI:
```bash
docker build -f Dockerfile.prod -t ai-ecommerce-frontend:latest .
```

Or use npm script:
```bash
npm run docker:build:prod
```

### Run Production Container

Basic run:
```bash
docker run -p 80:80 ai-ecommerce-frontend:latest
```

With custom environment:
```bash
docker run -p 80:80 \
  -e VITE_API_BASE_URL=https://api.yourdomain.com \
  ai-ecommerce-frontend:latest
```

Note: Environment variables must be set at build time for Vite apps.

### Build with Production Environment

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=AI E-Commerce
VITE_DEBUG=false
```

Build with production env:
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com \
  -f Dockerfile.prod \
  -t ai-ecommerce-frontend:latest \
  .
```

### Health Check

The production container includes a health check:
```bash
docker ps
```

Check `STATUS` column for health status.

### Production Image Optimization

The production image is optimized:
- Multi-stage build reduces image size
- Static files served by Nginx
- Gzip compression enabled
- Security headers configured
- Cache headers for assets

Typical image sizes:
- Development: ~500MB (includes source, tools)
- Production: ~25MB (only nginx + static files)

## Docker Compose

### Frontend-Only Compose (`docker-compose.frontend.yml`)

```yaml
services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
```

### Full Stack Compose (`docker-compose.full.yml`)

Includes:
- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache
- **rabbitmq**: RabbitMQ 3 message broker
- **backend**: Java Spring Boot API
- **frontend**: React Vite app

All services connected via `ai-ecommerce-network`.

### Environment Variables in Docker Compose

Environment variables can be set in two ways:

**Option 1: Create a `.env` file** (recommended):
```env
VITE_API_BASE_URL=http://backend:8080/api
VITE_DEBUG=false
VITE_APP_NAME=My E-Commerce
```

Docker Compose automatically loads `.env` files from the current directory.

**Option 2: Override inline defaults**:
The docker-compose files use default values with `${VAR:-default}` syntax.
You can override by setting environment variables before running docker-compose:

```bash
export VITE_API_BASE_URL=http://my-backend:8080/api
docker-compose -f docker-compose.frontend.yml up
```

**Option 3: Edit docker-compose.yml directly**:
Modify the environment values directly in the docker-compose file (not recommended for sensitive data).

## Advanced Configuration

### Custom Nginx Configuration

Edit `nginx.conf` to customize:
- Cache policies
- Security headers
- Proxy settings
- Compression

Rebuild after changes:
```bash
docker build -f Dockerfile.prod -t ai-ecommerce-frontend:latest .
```

### Multi-Stage Build Optimization

The production Dockerfile uses multi-stage builds:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
# ... build steps ...

# Stage 2: Serve
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
```

Benefits:
- Smaller final image
- No build tools in production
- Improved security

### Volume Mounts for Development

For hot reload in Docker:

```bash
docker run -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -v $(pwd)/index.html:/app/index.html \
  -v /app/node_modules \
  ai-ecommerce-frontend:dev
```

Note: `/app/node_modules` prevents local files from overwriting container's node_modules.

### Network Configuration

#### Connect Frontend to External Backend

If backend is running locally (not in Docker):

```bash
docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=http://host.docker.internal:8080/api \
  ai-ecommerce-frontend:dev
```

`host.docker.internal` resolves to host machine.

#### Custom Docker Network

Create network:
```bash
docker network create ai-ecommerce
```

Run with network:
```bash
docker run -p 5173:5173 \
  --network ai-ecommerce \
  --name frontend \
  ai-ecommerce-frontend:dev
```

### Building for Different Architectures

Build for multiple platforms:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ai-ecommerce-frontend:latest \
  -f Dockerfile.prod \
  .
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker logs <container-id>
```

Or with Docker Compose:
```bash
docker-compose -f docker-compose.frontend.yml logs frontend
```

### Port Already in Use

Change exposed port:
```bash
docker run -p 8080:5173 ai-ecommerce-frontend:dev
```

Or in `docker-compose.yml`:
```yaml
ports:
  - "8080:5173"
```

### Hot Reload Not Working

Ensure volumes are mounted:
```bash
docker run -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  -v /app/node_modules \
  ai-ecommerce-frontend:dev
```

Check Vite config has polling enabled:
```typescript
watch: {
  usePolling: true,
}
```

### Cannot Connect to Backend

**If backend is in same docker-compose**:
```env
VITE_API_BASE_URL=http://backend:8080/api
```

**If backend is on host machine**:
```env
VITE_API_BASE_URL=http://host.docker.internal:8080/api
```

**If backend is remote**:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Build Fails

Clear Docker cache:
```bash
docker system prune -a
```

Rebuild without cache:
```bash
docker build --no-cache -t ai-ecommerce-frontend:dev .
```

### Out of Disk Space

Remove unused images:
```bash
docker image prune -a
```

Remove all stopped containers:
```bash
docker container prune
```

Remove all unused volumes:
```bash
docker volume prune
```

### Permission Issues (Linux)

If you get permission errors:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Restart Docker daemon:
```bash
sudo systemctl restart docker
```

### Node Modules Not Found

Ensure node_modules is preserved:
```bash
docker run -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  -v /app/node_modules \
  ai-ecommerce-frontend:dev
```

The `-v /app/node_modules` creates an anonymous volume.

## Best Practices

### Development

1. Use Docker Compose for consistent environment
2. Mount source directories for hot reload
3. Use named volumes for node_modules
4. Keep `.dockerignore` updated

### Production

1. Use multi-stage builds
2. Run as non-root user (nginx does this)
3. Scan images for vulnerabilities
4. Use specific version tags, not `latest`
5. Set appropriate resource limits

### Performance

1. Use `.dockerignore` to exclude files
2. Layer caching: copy package.json first
3. Use Alpine images when possible
4. Multi-stage builds to reduce size

## Next Steps

- [Frontend Setup Guide](FRONTEND_SETUP.md) - Local development setup
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflow
- [API Integration Guide](API_INTEGRATION.md) - Backend integration

## Support

For issues:
- Check Docker logs: `docker logs <container>`
- Verify Docker version: `docker --version`
- Review [main README](README.md)
- Create an issue in the repository

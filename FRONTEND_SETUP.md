# Frontend Setup Guide

This guide provides comprehensive instructions for setting up the AI E-Commerce frontend application for local development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

- **Node.js**: Version 18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: Version 9.x or higher (comes with Node.js)
  - Verify installation: `npm --version`

### Optional (for Docker)

- **Docker**: Latest version
  - Download from [docker.com](https://www.docker.com/)
  - Verify installation: `docker --version`

- **Docker Compose**: Version 2.x or higher
  - Usually included with Docker Desktop
  - Verify installation: `docker-compose --version`

## Quick Start

The fastest way to get started is using one of our automated setup scripts:

### Linux/Mac

```bash
./setup.sh
```

### Windows (PowerShell)

```powershell
.\setup.ps1
```

### Windows (Batch)

```batch
setup.bat
```

These scripts will:
1. Check prerequisites (Node.js, npm, Docker)
2. Create `.env.local` from template
3. Install npm dependencies
4. Offer to start the development server

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-ecommerce-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Configure Environment Variables

Create a `.env.local` file for local development:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update the values:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:9090/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your-local-jwt-secret-key

# Application
VITE_APP_NAME=AI E-Commerce
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true

# Features
VITE_ENABLE_AI_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=false

# Environment
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

## Environment Configuration

The application uses different environment configurations for different scenarios:

### Local Development (`.env.local`)

Used when running `npm run dev` locally:
- Backend API: `http://localhost:9090/api`
- Debug mode: Enabled
- Connects to locally running backend

### Docker Development (`.env.docker.example`)

Used in Docker Compose:
- Backend API: `http://backend:9090/api`
- Uses Docker service names for networking
- Debug mode: Disabled

### Production (`.env`)

Used for production builds:
- Backend API: Production URL
- Debug mode: Disabled
- Optimized for performance

### Environment Variable Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:9090/api` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `VITE_JWT_SECRET` | JWT secret key | - |
| `VITE_APP_NAME` | Application name | `AI E-Commerce` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_DEBUG` | Enable debug mode | `true` |
| `VITE_ENABLE_AI_RECOMMENDATIONS` | Enable AI features | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `NODE_ENV` | Environment mode | `development` |

## Running the Application

### Available NPM Scripts

```bash
# Development
npm run dev              # Start development server (port 5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript type checking

# Docker
npm run docker:build     # Build development Docker image
npm run docker:build:prod # Build production Docker image
npm run docker:run       # Run development Docker container
npm run docker:run:prod  # Run production Docker container
```

### Development Server Options

Run on a different port:
```bash
npm run dev -- --port 5173
```

Open in browser automatically:
```bash
npm run dev -- --open
```

### Building for Production

1. Build the application:
```bash
npm run build
```

2. The output will be in the `dist/` directory

3. Preview the production build:
```bash
npm run preview
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

**Option 1**: Kill the process using the port
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Option 2**: Use a different port
```bash
npm run dev -- --port 3000
```

### Node Version Issues

If you have the wrong Node.js version:

**Using nvm (Node Version Manager)**:
```bash
# Install nvm first, then:
nvm install 18
nvm use 18
```

### Module Not Found Errors

If you encounter module errors:

1. Delete `node_modules` and `package-lock.json`:
```bash
rm -rf node_modules package-lock.json
```

2. Clear npm cache:
```bash
npm cache clean --force
```

3. Reinstall dependencies:
```bash
npm install
```

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify backend is running on `http://localhost:9090`
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Check for CORS issues in browser console
4. Ensure backend allows requests from `http://localhost:5173`

### Build Failures

If TypeScript compilation fails:

1. Run type checking:
```bash
npm run type-check
```

2. Fix type errors in your code

3. Try building again:
```bash
npm run build
```

### Hot Reload Not Working

If changes aren't reflected automatically:

1. Check if the dev server is running
2. Restart the dev server:
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

### ESLint/Prettier Conflicts

If linting and formatting clash:

1. Format first:
```bash
npm run format
```

2. Then fix linting issues:
```bash
npm run lint:fix
```

## Next Steps

- [Docker Setup Guide](FRONTEND_DOCKER.md) - Run using Docker
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflow
- [API Integration Guide](API_INTEGRATION.md) - Backend integration

## Support

For additional help:
- Check the [main README](README.md)
- Review existing issues in the repository
- Create a new issue if needed

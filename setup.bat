@echo off
REM AI E-Commerce Frontend Setup Script for Windows (Batch)
REM This script automates the setup process for local development

echo ======================================
echo AI E-Commerce Frontend Setup
echo ======================================
echo.

echo Checking prerequisites...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18.x or higher from https://nodejs.org/
    exit /b 1
)

node --version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to get Node.js version
    exit /b 1
)
echo [OK] Node.js is installed

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)

npm --version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to get npm version
    exit /b 1
)
echo [OK] npm is installed

REM Check Docker (optional)
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker is installed
) else (
    echo [INFO] Docker is not installed (optional for local development)
)

echo.
echo ======================================
echo Setting up environment...
echo ======================================

REM Create .env.local from template if it doesn't exist
if not exist .env.local (
    if exist .env.local.example (
        copy .env.local.example .env.local
        echo [OK] Created .env.local from template
    ) else (
        echo [INFO] No .env.local.example found, creating default .env.local
        (
            echo VITE_API_BASE_URL=http://localhost:8080/api
            echo VITE_API_TIMEOUT=30000
            echo VITE_JWT_SECRET=your-local-jwt-secret-key
            echo VITE_APP_NAME=AI E-Commerce
            echo VITE_APP_VERSION=1.0.0
            echo VITE_DEBUG=true
            echo VITE_ENABLE_AI_RECOMMENDATIONS=true
            echo VITE_ENABLE_ANALYTICS=false
            echo NODE_ENV=development
        ) > .env.local
        echo [OK] Created default .env.local
    )
) else (
    echo [INFO] .env.local already exists, skipping
)

echo.
echo ======================================
echo Installing dependencies...
echo ======================================

REM Install npm dependencies
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed successfully

echo.
echo ======================================
echo Setup completed successfully!
echo ======================================
echo.
echo Available commands:
echo   npm run dev        - Start development server
echo   npm run build      - Build for production
echo   npm run preview    - Preview production build
echo   npm run lint       - Run ESLint
echo.
echo Docker commands (if Docker is installed):
echo   docker build -t ai-ecommerce-frontend:dev .
echo   docker run -p 5173:5173 ai-ecommerce-frontend:dev
echo.
echo Docker Compose commands (if Docker Compose is installed):
echo   docker-compose -f docker-compose.frontend.yml up
echo   docker-compose -f docker-compose.full.yml up
echo.

REM Ask if user wants to start the dev server
set /p START_SERVER="Would you like to start the development server now? (y/n): "
if /i "%START_SERVER%"=="y" (
    echo.
    echo Starting development server...
    echo The application will be available at: http://localhost:5173
    echo.
    npm run dev
)

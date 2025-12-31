# AI E-Commerce Frontend Setup Script for Windows (PowerShell)
# This script automates the setup process for local development

param(
    [switch]$SkipPrompt
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "AI E-Commerce Frontend Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

# Check if Node.js is installed
Write-Host "Checking prerequisites..."
try {
    $nodeVersion = node --version
    $nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($nodeMajorVersion -lt 18) {
        Print-Error "Node.js version 18 or higher is required (found: $nodeVersion)"
        exit 1
    }
    Print-Success "Node.js $nodeVersion is installed"
}
catch {
    Print-Error "Node.js is not installed"
    Write-Host "Please install Node.js 18.x or higher from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Print-Success "npm $npmVersion is installed"
}
catch {
    Print-Error "npm is not installed"
    exit 1
}

# Check Docker (optional)
$dockerAvailable = $false
try {
    $dockerVersion = docker --version
    Print-Success "Docker $dockerVersion is installed"
    $dockerAvailable = $true
}
catch {
    Print-Info "Docker is not installed (optional for local development)"
}

# Check Docker Compose (optional)
$composeAvailable = $false
try {
    $composeVersion = docker-compose --version
    Print-Success "Docker Compose $composeVersion is installed"
    $composeAvailable = $true
}
catch {
    Print-Info "Docker Compose is not installed (optional for local development)"
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setting up environment..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Create .env.local from template if it doesn't exist
if (-not (Test-Path .env.local)) {
    if (Test-Path .env.local.example) {
        Copy-Item .env.local.example .env.local
        Print-Success "Created .env.local from template"
    }
    else {
        Print-Info "No .env.local.example found, creating default .env.local"
        $envContent = @"
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_JWT_SECRET=your-local-jwt-secret-key
VITE_APP_NAME=AI E-Commerce
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_ENABLE_AI_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=false
NODE_ENV=development
"@
        Set-Content -Path .env.local -Value $envContent
        Print-Success "Created default .env.local"
    }
}
else {
    Print-Info ".env.local already exists, skipping"
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Install npm dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Print-Success "Dependencies installed successfully"
}
else {
    Print-Error "Failed to install dependencies"
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available commands:"
Write-Host "  npm run dev        - Start development server"
Write-Host "  npm run build      - Build for production"
Write-Host "  npm run preview    - Preview production build"
Write-Host "  npm run lint       - Run ESLint"
Write-Host ""

if ($dockerAvailable) {
    Write-Host "Docker commands:"
    Write-Host "  docker build -t ai-ecommerce-frontend:dev ."
    Write-Host "  docker run -p 5173:5173 ai-ecommerce-frontend:dev"
    Write-Host ""
}

if ($composeAvailable) {
    Write-Host "Docker Compose commands:"
    Write-Host "  docker-compose -f docker-compose.frontend.yml up"
    Write-Host "  docker-compose -f docker-compose.full.yml up"
    Write-Host ""
}

# Ask if user wants to start the dev server
if (-not $SkipPrompt) {
    $response = Read-Host "Would you like to start the development server now? (y/n)"
    if ($response -match '^[Yy]$') {
        Write-Host ""
        Write-Host "Starting development server..."
        Write-Host "The application will be available at: http://localhost:3000"
        Write-Host ""
        npm run dev
    }
}

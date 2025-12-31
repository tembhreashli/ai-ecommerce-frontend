#!/bin/bash
# AI E-Commerce Frontend Setup Script for Linux/Mac
# This script automates the setup process for local development

set -e

echo "======================================"
echo "AI E-Commerce Frontend Setup"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18.x or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required (found: $(node -v))"
    exit 1
fi
print_success "Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm -v) is installed"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    print_success "Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) is installed"
    DOCKER_AVAILABLE=true
else
    print_info "Docker is not installed (optional for local development)"
    DOCKER_AVAILABLE=false
fi

# Check Docker Compose (optional)
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose $(docker-compose --version | cut -d' ' -f4 | cut -d',' -f1) is installed"
    COMPOSE_AVAILABLE=true
else
    print_info "Docker Compose is not installed (optional for local development)"
    COMPOSE_AVAILABLE=false
fi

echo ""
echo "======================================"
echo "Setting up environment..."
echo "======================================"

# Create .env.local from template if it doesn't exist
if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        print_success "Created .env.local from template"
    else
        print_info "No .env.local.example found, creating default .env.local"
        cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_JWT_SECRET=your-local-jwt-secret-key
VITE_APP_NAME=AI E-Commerce
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_ENABLE_AI_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=false
NODE_ENV=development
EOF
        print_success "Created default .env.local"
    fi
else
    print_info ".env.local already exists, skipping"
fi

echo ""
echo "======================================"
echo "Installing dependencies..."
echo "======================================"

# Install npm dependencies
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "======================================"
echo "Setup completed successfully!"
echo "======================================"
echo ""
echo "Available commands:"
echo "  npm run dev        - Start development server"
echo "  npm run build      - Build for production"
echo "  npm run preview    - Preview production build"
echo "  npm run lint       - Run ESLint"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "Docker commands:"
    echo "  docker build -t ai-ecommerce-frontend:dev ."
    echo "  docker run -p 5173:5173 ai-ecommerce-frontend:dev"
    echo ""
fi

if [ "$COMPOSE_AVAILABLE" = true ]; then
    echo "Docker Compose commands:"
    echo "  docker-compose -f docker-compose.frontend.yml up"
    echo "  docker-compose -f docker-compose.full.yml up"
    echo ""
fi

# Ask if user wants to start the dev server
read -p "Would you like to start the development server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting development server..."
    echo "The application will be available at: http://localhost:3000"
    echo ""
    npm run dev
fi

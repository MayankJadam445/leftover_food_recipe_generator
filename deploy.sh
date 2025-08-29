#!/bin/bash

# Simple deployment script for Recipe Finder
# This script helps deploy the application to various platforms

echo "🍛 Recipe Finder Deployment Script"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Start local development server
start_dev() {
    echo "Starting development server..."
    
    # Change to the script's directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    
    if command_exists python3; then
        python3 -m http.server 8000
    elif command_exists python; then
        python -m http.server 8000
    elif command_exists node; then
        npx serve . -l 8000
    else
        echo "❌ No suitable server found. Please install Python or Node.js"
        exit 1
    fi
}

# Build for production (minify files)
build_prod() {
    echo "Building for production..."
    
    # Create dist directory
    mkdir -p dist
    
    # Copy files
    cp -r assets dist/
    cp index.html dist/
    cp README.md dist/
    
    echo "✅ Production build created in 'dist' folder"
}

# Deploy to GitHub Pages
deploy_github() {
    echo "Deploying to GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        echo "❌ Not a git repository. Initialize git first."
        exit 1
    fi
    
    git add .
    git commit -m "Deploy Recipe Finder v$(date +%Y%m%d-%H%M%S)"
    git push origin main
    
    echo "✅ Pushed to GitHub. Enable GitHub Pages in repository settings."
}

# Show help
show_help() {
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev     Start development server"
    echo "  build   Build for production"
    echo "  github  Deploy to GitHub"
    echo "  help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh dev      # Start local server"
    echo "  ./deploy.sh build    # Create production build"
    echo "  ./deploy.sh github   # Deploy to GitHub Pages"
}

# Main script logic
case "$1" in
    "dev"|"start")
        start_dev
        ;;
    "build"|"prod")
        build_prod
        ;;
    "github"|"gh")
        deploy_github
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Invalid option. Use 'help' to see available options."
        show_help
        exit 1
        ;;
esac

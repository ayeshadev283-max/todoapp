#!/bin/bash
# Deploy Backend to Hugging Face Spaces
# Usage: ./deploy-to-hf.sh YOUR_USERNAME YOUR_SPACE_NAME

set -e  # Exit on error

# Check arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: ./deploy-to-hf.sh YOUR_USERNAME YOUR_SPACE_NAME"
    echo "Example: ./deploy-to-hf.sh johndoe todo-api-backend"
    exit 1
fi

USERNAME=$1
SPACE_NAME=$2
SPACE_URL="https://huggingface.co/spaces/$USERNAME/$SPACE_NAME"

echo "======================================"
echo "Deploying to Hugging Face Spaces"
echo "======================================"
echo "Space: $SPACE_URL"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
echo "📁 Created temp directory: $TEMP_DIR"

# Clone the Space
echo "📥 Cloning Space repository..."
git clone https://huggingface.co/spaces/$USERNAME/$SPACE_NAME $TEMP_DIR

# Copy backend files
echo "📋 Copying backend files..."
cd backend

# Copy all necessary files
cp -r app $TEMP_DIR/
cp -r alembic $TEMP_DIR/
cp Dockerfile $TEMP_DIR/
cp README.md $TEMP_DIR/
cp requirements.txt $TEMP_DIR/
cp alembic.ini $TEMP_DIR/
cp .dockerignore $TEMP_DIR/ 2>/dev/null || true
cp CLAUDE.md $TEMP_DIR/ 2>/dev/null || true
cp HUGGINGFACE_DEPLOY.md $TEMP_DIR/ 2>/dev/null || true

# Go to temp directory and commit
cd $TEMP_DIR
echo "📦 Staging files..."
git add .

echo "💾 Creating commit..."
git commit -m "Deploy FastAPI backend to Hugging Face Spaces

- FastAPI application with JWT authentication
- PostgreSQL database with SQLModel
- Alembic migrations
- Docker deployment configuration"

echo "🚀 Pushing to Hugging Face..."
git push

echo ""
echo "======================================"
echo "✅ Deployment Complete!"
echo "======================================"
echo ""
echo "Your API will be available at:"
echo "🔗 $SPACE_URL"
echo ""
echo "Build will start automatically (takes 2-5 minutes)"
echo "Check build status at: $SPACE_URL"
echo ""
echo "Once deployed:"
echo "  - API Docs: $SPACE_URL/docs"
echo "  - Health Check: $SPACE_URL/health"
echo ""

# Cleanup
cd -
rm -rf $TEMP_DIR
echo "🧹 Cleaned up temporary files"

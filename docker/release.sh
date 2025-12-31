#!/bin/bash
set -e

VERSION="${1}"
IMAGE_NAME="promptclarity/promptclarity"

if [ -z "$VERSION" ]; then
    echo "Usage: ./docker/release.sh <version>"
    echo "Example: ./docker/release.sh 1.0"
    exit 1
fi

echo "=== Releasing v$VERSION ==="

# Create and push git tag
echo "Creating git tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"
git push public "v$VERSION"

# Build Docker image with version tag and latest
echo "Building Docker image..."
docker build --no-cache -t "$IMAGE_NAME:$VERSION" -t "$IMAGE_NAME:latest" .

# Push both tags
echo "Pushing $IMAGE_NAME:$VERSION..."
docker push "$IMAGE_NAME:$VERSION"

echo "Pushing $IMAGE_NAME:latest..."
docker push "$IMAGE_NAME:latest"

echo ""
echo "=== Release v$VERSION complete ==="
echo "Git tag: v$VERSION"
echo "Docker: $IMAGE_NAME:$VERSION"
echo "Docker: $IMAGE_NAME:latest"

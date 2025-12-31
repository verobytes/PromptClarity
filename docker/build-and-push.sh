#!/bin/bash
set -e

IMAGE_NAME="promptclarity/promptclarity"
TAG="${1:-latest}"

echo "Building $IMAGE_NAME:$TAG..."
docker build --no-cache -t "$IMAGE_NAME:$TAG" .

echo "Pushing $IMAGE_NAME:$TAG..."
docker push "$IMAGE_NAME:$TAG"

echo "Done! Image pushed to $IMAGE_NAME:$TAG"

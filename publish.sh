#!/bin/bash
set -e  # exit on error

# Default bump type is "patch" unless passed as argument
BUMP_TYPE=${1:-patch}

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Increment version using npm version
echo "🔼 Bumping version ($BUMP_TYPE)..."
NEW_VERSION=$(npm version $BUMP_TYPE --no-git-tag-version)

echo "✅ New version: $NEW_VERSION"

# Publish to npm
echo "🚀 Publishing package..."
npm publish

echo "🎉 Published $NEW_VERSION successfully!"

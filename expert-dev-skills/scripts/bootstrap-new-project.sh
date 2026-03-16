#!/bin/bash

# 🚀 Expert Framework Bootstrapper
# This script copies the Expert Persona, CI/CD pipelines, and Architecture Rules
# to a new project directory to jumpstart production-grade development.

if [ -z "$1" ]; then
    echo "❌ Usage: ./bootstrap-new-project.sh <target_directory_path>"
    exit 1
fi

TARGET_DIR="$1"
SOURCE_DIR=$(pwd)

echo "🛠️  Creating target directory at $TARGET_DIR..."
mkdir -p "$TARGET_DIR"

# 1. Copy Architecture & Security Rules
echo "🏗️  Injecting Architecture & Security Rules..."
cp -r "$SOURCE_DIR/.windsurf" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/expert-dev-skills" "$TARGET_DIR/"

# 2. Copy CI/CD Quality Gates
echo "🚀 Injecting CI/CD Quality Gates..."
mkdir -p "$TARGET_DIR/.github"
cp -r "$SOURCE_DIR/.github/workflows" "$TARGET_DIR/.github/"

# 3. Copy Base Architecture Templates (Optional but Recommended)
echo "🧱 Injecting Base Architecture (Android Template)..."
mkdir -p "$TARGET_DIR/app/src/main/java/com/company/app"
cp -r "$SOURCE_DIR/app/src/main/java/com/company/app/"* "$TARGET_DIR/app/src/main/java/com/company/app/"

# 4. Initialize Local Sentinel
echo "🛡️  Initializing Local PR Sentinel..."
chmod +x "$TARGET_DIR/expert-dev-skills/code-review/scripts/review-pr.sh"

echo ""
echo "✅ Expert Framework Successfully Bootstrapped!"
echo "------------------------------------------------"
echo "Next Steps for your new project:"
echo "1. CD into $TARGET_DIR"
echo "2. Initialize your Android or Web project inside this folder."
echo "3. Run 'npm init' or 'gradle init' as needed."
echo "4. Use 'ln -s ../../expert-dev-skills/code-review/scripts/review-pr.sh .git/hooks/pre-commit' to enable local architecture guarding."
echo "------------------------------------------------"

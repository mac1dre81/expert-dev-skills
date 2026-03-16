#!/bin/bash

# 🔍 Expert PR Review Sentinel
# A local-first script for checking security, architecture, and performance.

# Exit on first error if needed, but here we want to collect all warnings
# set -e

echo "🚀 Starting Local PR Review Analysis..."

# 1. Security Scan (Secrets)
echo "🛡️ Scanning for hardcoded secrets..."
# Exclude markdown, json, and test files to reduce false positives
SECRETS=$(grep -rEi "api_key|secret|password|token|bearer" . --exclude-dir={.git,node_modules,build,.idea} | grep -vE "\.md|\.json|test|review-pr\.sh")
if [ -n "$SECRETS" ]; then
    echo "❌ WARNING: Potential secrets found in code:"
    echo "$SECRETS"
else
    echo "✅ No secrets found in code."
fi

# 2. Architectural Check (Android)
echo "🏗️ Validating Android Architecture & Naming..."
if [ -d "app/src/main/java" ]; then
    STRUCTURE=$(find app/src/main/java -maxdepth 10 -not -path '*/.*')

    # Verify core layer existence
    for dir in data domain presentation di; do
        if [[ ! "$STRUCTURE" =~ $dir ]]; then
            echo "⚠️  Missing standard directory: $dir (Recommended by .windsurf/rules/android-arch.md)"
        fi
    done

    # Check for Forbidden Imports: ViewModels should NOT import android.app or android.view
    echo "🕵️ Checking for Architecture Leakage (UI in ViewModels)..."
    VM_LEAKS=$(grep -rE "import android\.(app|view|widget)" . --include="*ViewModel.kt")
    if [ -n "$VM_LEAKS" ]; then
        echo "❌ ARCHITECTURE VIOLATION: ViewModels found importing UI classes:"
        echo "$VM_LEAKS"
    else
        echo "✅ ViewModel isolation verified."
    fi
fi

# 3. Performance & Clean Code Check (React)
echo "⚡ Checking for React anti-patterns..."
# Check for common React useEffect without cleanup
# We look for useEffect but missing the return arrow function
CLEANUP_MISSING=$(grep -rl "useEffect" . --include="*.tsx" --include="*.jsx" | xargs grep -L "return () =>")
if [ -n "$CLEANUP_MISSING" ]; then
    echo "⚠️  React: Potential missing cleanup in useEffect in these files:"
    echo "$CLEANUP_MISSING"
fi

# 4. Git Integration (Expert Step)
if [ ! -f ".git/hooks/pre-commit" ]; then
    echo "💡 TIP: Run 'ln -s ../../expert-dev-skills/code-review/scripts/review-pr.sh .git/hooks/pre-commit' to automate this check!"
fi

echo "✅ Local PR Review Complete."

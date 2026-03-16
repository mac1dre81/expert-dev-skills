#!/bin/bash

# expert-dev-skills/code-review/scripts/review-pr.sh
# Local PR review checks – architecture, secrets, performance, etc.

set -euo pipefail

# Template & Project Context Detection
echo "Detecting project context..."

IS_TEMPLATE=false
IS_ANDROID=false
IS_REACT=false

if [ -d "expert-dev-skills" ] && ls .windsurf/rules* >/dev/null 2>&1; then
    IS_TEMPLATE=true
    echo "Template repository detected - some checks will be relaxed"
fi

if [ -f "gradlew" ] || [ -d "app/src/main" ]; then
    IS_ANDROID=true
    echo "Android project detected"
fi

if [ -f "package.json" ] && grep -q "react" package.json; then
    IS_REACT=true
    echo "React project detected"
fi

echo ""

# 1. Enhanced Secret Scanner – ignores comments & common false positives
echo "Scanning for hardcoded secrets (ignoring comments)..."

SECRET_PATTERNS=(
    'api[_-]?key\s*[=:]\s*['\''"]?[0-9a-zA-Z]{16,}['\''"]?'
    'token\s*[=:]\s*['\''"]?[0-9a-zA-Z]{16,}['\''"]?'
    'password\s*[=:]\s*['\''"]?[^'\''"]{8,}['\''"]?'
    'secret\s*[=:]\s*['\''"]?[0-9a-zA-Z]{16,}['\''"]?'
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    grep -r -n --include="*.{kt,java,js,ts,tsx,py,go}" "$pattern" . 2>/dev/null | \
    grep -v -E "^\s*//|^\s*#|^\s*\*|^\s*/\*|In a real app|TODO|FIXME|example" || true
done

echo ""

# 2. Android Architecture & ViewModel Leak Checks
if [ "$IS_ANDROID" = true ]; then
    echo "Validating Android Architecture & Naming..."

    STANDARD_DIRS=("presentation" "di" "domain" "data")

    for dir in "${STANDARD_DIRS[@]}"; do
        if [ ! -d "app/src/main/java/com/company/app/$dir" ] && [ "$IS_TEMPLATE" = false ]; then
            echo "Missing recommended directory: $dir (see .windsurf/rules/android-arch.md)"
        elif [ ! -d "app/src/main/java/com/company/app/$dir" ] && [ "$IS_TEMPLATE" = true ]; then
            echo "Template missing $dir directory (expected)"
        fi
    done

    echo ""
    echo "Checking ViewModel isolation (no UI imports)..."

    VM_LEAKS=$(grep -rE "import android\.(app|view|widget)" . --include="*ViewModel.kt" || true)
    if [ -n "$VM_LEAKS" ]; then
        echo "ARCHITECTURE VIOLATION: ViewModels found importing UI classes:"
        echo "$VM_LEAKS"
    else
        echo "ViewModel isolation verified."
    fi

    echo ""
fi

# 3. Android Lint Check
if [ "$IS_ANDROID" = true ] && [ -f "gradlew" ]; then
    echo "Running Android Lint..."

    ./gradlew lint > /tmp/lint_output.txt 2>&1 || true

    if grep -q "error:" /tmp/lint_output.txt; then
        echo "Lint found errors that must be fixed:"
        grep -A 5 "error:" /tmp/lint_output.txt | head -n 30
        # Do NOT exit 1 here unless you want to block commit
    elif [ "$IS_TEMPLATE" = false ]; then
        WARNINGS=$(grep -c "warning:" /tmp/lint_output.txt || true)
        if [ "$WARNINGS" -gt 0 ]; then
            echo "Lint found $WARNINGS warnings - consider fixing:"
            grep -B 1 -A 2 "warning:" /tmp/lint_output.txt | head -n 20
        else
            echo "Lint passed cleanly"
        fi
    else
        echo "Lint passed (template mode - errors ignored)"
    fi

    rm -f /tmp/lint_output.txt
    echo ""
fi

# 4. React Anti-Patterns & Performance Checks
if [ "$IS_REACT" = true ]; then
    echo "Checking for React anti-patterns..."

    # Missing cleanup in useEffect
    CLEANUP_MISSING=$(grep -rl "useEffect" . --include="*.tsx" --include="*.jsx" | xargs grep -L "return () =>" || true)
    if [ -n "$CLEANUP_MISSING" ]; then
        echo "Potential missing cleanup in useEffect:"
        echo "$CLEANUP_MISSING"
    else
        echo "useEffect cleanup looks good"
    fi

    echo ""
    echo "Checking React performance patterns..."

    # Components without memoization (basic heuristic)
    grep -r -l --include="*.{js,ts,tsx}" "function.*Props" . 2>/dev/null | while read -r file; do
        if ! grep -q "useMemo\|useCallback" "$file" && [ "$IS_TEMPLATE" = false ]; then
            echo "Component without memoization: $file"
        fi
    done

    # Inline style objects (causes re-renders)
    grep -r -n --include="*.{js,ts,tsx}" "style={{.*}}" . 2>/dev/null | while read -r line; do
        if [ "$IS_TEMPLATE" = false ]; then
            echo "Inline style object (potential re-render issue): $line"
        fi
    done

    # Bundle size check (if build exists)
    if [ -d "build/static/js" ] || [ -d "dist" ]; then
        echo ""
        echo "Checking bundle size..."

        if command -v npx >/dev/null && [ -f "node_modules/.bin/source-map-explorer" ]; then
            npx source-map-explorer build/static/js/*.js --html bundle-analysis.html 2>/dev/null || true
            echo "Bundle analysis HTML generated (if successful)"
        else
            echo "Install source-map-explorer for better bundle insights: npm install --save-dev source-map-explorer"
        fi

        TOTAL_SIZE=$(du -sk build/static/js 2>/dev/null | cut -f1 || echo 0)
        if [ "$TOTAL_SIZE" -gt 300 ] && [ "$IS_TEMPLATE" = false ]; then
            echo "Bundle size ~${TOTAL_SIZE}KB exceeds 300KB soft threshold"
        fi
    fi

    # Lighthouse suggestion
    if ! grep -q "lighthouse" package.json 2>/dev/null && [ "$IS_TEMPLATE" = false ]; then
        echo ""
        echo "Consider adding Lighthouse CI for performance budgets:"
        echo "   npm install --save-dev @lhci/cli"
        echo "   Add to package.json scripts: \"lighthouse\": \"lhci autorun\""
    fi

    echo ""
fi

# Final message
echo "Local PR Review Complete."
echo "    (some warnings are informational – only errors should block merge)"

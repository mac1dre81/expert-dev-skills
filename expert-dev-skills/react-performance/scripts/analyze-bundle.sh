#!/bin/bash

# analyze-bundle.sh - React Bundle Analysis Tool

echo "📦 Analyzing React bundle size..."

# Check if source-map-explorer is installed
if ! command -v source-map-explorer &> /dev/null; then
    echo "Installing source-map-explorer..."
    npm install -g source-map-explorer
fi

# Build with source maps
echo "🔨 Building with source maps..."
GENERATE_SOURCEMAP=true npm run build

# Analyze
echo "🔍 Analyzing bundle..."
source-map-explorer build/static/js/*.js --html bundle-analysis.html

echo "✅ Analysis complete! Open bundle-analysis.html to view results"

# Show top 5 largest chunks
echo ""
echo "📊 Top 5 largest chunks:"
find build/static/js -name "*.js" -exec ls -lh {} \; | sort -k5 -rh | head -5

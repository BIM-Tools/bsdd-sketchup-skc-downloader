#!/bin/bash

# bSDD API Client Generation Script
# This script downloads the latest OpenAPI specification and generates TypeScript client

set -e

echo "🔄 Downloading bSDD API specification..."
curl -o "../api-specs/swagger.json" "https://app.swaggerhub.com/apiproxy/registry/buildingSMART/Dictionaries/v1/swagger.json"

echo "✅ Downloaded swagger.json"

echo "🛠️  Generating TypeScript API client..."
npx @openapitools/openapi-generator-cli generate -c openapi-config.json

echo "🧹 Cleaning up generated files..."
# Remove unnecessary files from the generated output
rm -f ../src/generated/api/package.json
rm -f ../src/generated/api/tsconfig.json
rm -f ../src/generated/api/tsconfig.esm.json
rm -f ../src/generated/api/.npmignore
rm -f ../src/generated/api/README.md

echo "✅ TypeScript API client generated successfully!"
echo "📁 Generated files are in: src/generated/api/"

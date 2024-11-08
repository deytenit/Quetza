#!/bin/bash

set -e

mkdir -p .git/hooks

HOOK_CONTENT="#!/bin/sh
pnpm run lint
if [ \$? -ne 0 ]; then
    echo 'Pre-commit hook failed. Please fix the issues and commit again.'
    exit 1
fi
"

echo "$HOOK_CONTENT" > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit

echo "Pre-commit hook installed successfully!"

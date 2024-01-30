#!/bin/sh

# Build typescript
pnpm exec tsc --build

# Map path aliases from tsconfigs
for TS_CONFIG in ./config.tsconfig.json ./src/tsconfig.json ./modules/*/tsconfig.json; do
	pnpm exec tsc-alias -p "$TS_CONFIG"
done

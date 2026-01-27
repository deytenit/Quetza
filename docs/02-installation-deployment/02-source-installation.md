# 2.2 Source Installation

Installing Quetza from source gives you full control over the build process and is essential for development. This guide covers everything from cloning the repository to building production-ready artifacts.

## Table of Contents

- [Cloning the Repository](#cloning-the-repository)
- [Installing Dependencies](#installing-dependencies-pnpm)
- [Building from Source](#building-from-source)
- [Development vs Production Builds](#development-vs-production-builds)
- [Path Alias Resolution](#path-alias-resolution)

---

## Cloning the Repository

### Prerequisites

Before cloning, ensure you have:
- Git installed (`git --version`)
- SSH keys configured (for SSH clone) or GitHub access token (for HTTPS)

### Clone via HTTPS

```bash
# Clone the repository
git clone https://github.com/deytenit/Quetza.git

# Navigate to directory
cd Quetza
```

### Clone via SSH

```bash
# Clone with SSH (requires SSH keys)
git clone git@github.com:deytenit/Quetza.git

# Navigate to directory
cd Quetza
```

### Verify Clone

```bash
# Check repository structure
ls -la

# Should show:
# Dockerfile
# README.md
# build.sh
# config.ts
# modules/
# package.json
# src/
# tsconfig.json
```

### Checking Out Specific Versions

```bash
# List available tags
git tag -l

# Checkout specific version
git checkout tags/2024.11.0

# Create branch from tag
git checkout -b my-version tags/2024.11.0

# Return to latest development
git checkout master
```

### Forking for Development

If you plan to contribute or customize Quetza:

1. **Fork on GitHub**: Click "Fork" button on the repository page
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Quetza.git
   cd Quetza
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/deytenit/Quetza.git
   git fetch upstream
   ```
4. **Keep fork updated**:
   ```bash
   git checkout master
   git pull upstream master
   git push origin master
   ```

---

## Installing Dependencies (pnpm)

Quetza uses **pnpm** as its package manager for efficiency and strict dependency management.

### Why pnpm?

- **Disk space efficiency**: Shared dependency storage
- **Fast installations**: Faster than npm/yarn
- **Strict dependencies**: Prevents phantom dependencies
- **Project standard**: Required for consistency

### Installing pnpm

**Global Installation** (recommended):

```bash
# Using npm
npm install -g pnpm

# Using corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate

# Verify installation
pnpm --version
```

**Alternative Methods**:

```bash
# Using standalone script (Unix)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using Homebrew (macOS)
brew install pnpm

# Using Chocolatey (Windows)
choco install pnpm
```

### Package Manager Enforcement

Quetza enforces pnpm usage through a preinstall hook:

```json
{
  "scripts": {
    "preinstall": "pnpm dlx only-allow pnpm"
  }
}
```

**This means**:
- Running `npm install` will fail with an error
- Running `yarn install` will fail with an error
- Only `pnpm install` is permitted

### Installing Project Dependencies

```bash
# Install all dependencies (production + development)
pnpm install

# Install only production dependencies
pnpm install --prod

# Install specific dependency
pnpm add package-name

# Install development dependency
pnpm add -D package-name
```

### Dependency Overview

**Runtime Dependencies** (production):
```json
{
  "@discordjs/opus": "^0.9.0",
  "@discordjs/voice": "^0.17.0",
  "discord.js": "^14.16.3",
  "prism-media": "^1.3.5",
  "tweetnacl": "^1.0.3",
  "winston": "^3.16.0"
}
```

**Development Dependencies**:
```json
{
  "@types/node": "^22.9.0",
  "typescript": "^5.6.3",
  "tsc-alias": "^1.8.10",
  "eslint": "^9.14.0",
  "prettier": "^3.3.3",
  "mocha": "^10.8.2"
}
```

### Verifying Installation

```bash
# Check installed packages
pnpm list

# Check for outdated packages
pnpm outdated

# Verify package integrity
pnpm install --frozen-lockfile
```

### Troubleshooting Installation

**Issue**: `pnpm: command not found`
```bash
# Solution: Install pnpm globally or use npx
npx pnpm install
```

**Issue**: Installation fails with permission errors
```bash
# Solution: Use correct permissions or fix npm prefix
npm config get prefix
# If needed, change to user directory
```

**Issue**: Lockfile conflicts
```bash
# Solution: Use frozen lockfile (CI mode)
pnpm install --frozen-lockfile

# Or regenerate lockfile (only if intended)
rm pnpm-lock.yaml
pnpm install
```

---

## Building from Source

Quetza uses TypeScript and requires compilation before running.

### Build Script

The build process is automated through `build.sh`:

```bash
#!/bin/sh

# Build typescript
pnpm exec tsc --build

# Map path aliases from tsconfigs
for TS_CONFIG in ./config.tsconfig.json ./src/tsconfig.json ./modules/*/tsconfig.json; do
    pnpm exec tsc-alias -p "$TS_CONFIG"
done
```

### Running the Build

```bash
# Execute build script
pnpm run build

# Or directly
./build.sh
```

**Build process**:
1. **TypeScript Compilation**: Compiles all `.ts` files to `.js`
2. **Path Alias Resolution**: Replaces TypeScript path aliases with relative paths

### Build Output

Compiled code is output to the `dist/` directory:

```
dist/
├── config.js           # Configuration module
├── config.js.map       # Source map
├── src/                # Compiled source
│   ├── index.js
│   ├── lib/
│   │   ├── client.js
│   │   ├── logger.js
│   │   └── ...
└── modules/            # Compiled modules
    ├── core/
    ├── music/
    └── ai/
```

### TypeScript Configuration

**Root tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "sourceMap": true,
    "target": "ES2022"
  },
  "references": [
    { "path": "./modules/core" },
    { "path": "./modules/music" },
    { "path": "./modules/ai" }
  ]
}
```

**Project References**: Quetza uses TypeScript project references for modular compilation:
- Each module has its own `tsconfig.json`
- Root config references all modules
- Enables incremental builds

### Incremental Builds

TypeScript generates `.tsbuildinfo` files for faster rebuilds:

```bash
# First build (slower)
pnpm run build

# Subsequent builds (faster - only changed files)
pnpm run build
```

### Clean Build

```bash
# Remove all build artifacts
pnpm run clean

# Clean and rebuild
pnpm run clean && pnpm run build
```

**What gets removed**:
- `dist/` directory and all contents
- `.tsbuildinfo` files

### Build Errors

**Common Issues**:

**Type errors**:
```bash
# Check types without building
pnpm exec tsc --noEmit

# View detailed errors
pnpm exec tsc --build --verbose
```

**Module resolution errors**:
```bash
# Verify tsconfig paths
cat tsconfig.json | grep -A 10 paths

# Check module imports
grep -r "from '@" src/ modules/
```

**Missing dependencies**:
```bash
# Reinstall dependencies
pnpm install

# Clear pnpm cache
pnpm store prune
```

---

## Development vs Production Builds

### Development Build

**Purpose**: Fast iteration during development with debugging support.

```bash
# Install all dependencies including dev tools
pnpm install

# Build with source maps
pnpm run build
```

**Characteristics**:
- ✅ Source maps enabled (`.js.map` files)
- ✅ All dev dependencies installed
- ✅ Faster builds (incremental compilation)
- ❌ Larger bundle size
- ❌ Not optimized for production

**Running in Development**:
```bash
# Set development environment
export NODE_ENV=development

# Run the bot
pnpm start

# Or with custom config
node --enable-source-maps ./dist/src/index.js
```

**Development Workflow**:
```bash
# Watch mode (manual - recommended setup)
# Terminal 1: Watch TypeScript
pnpm exec tsc --build --watch

# Terminal 2: Watch path aliases
while true; do
  pnpm exec tsc-alias -p ./config.tsconfig.json
  pnpm exec tsc-alias -p ./src/tsconfig.json
  for config in ./modules/*/tsconfig.json; do
    pnpm exec tsc-alias -p "$config"
  done
  sleep 2
done

# Terminal 3: Run bot (restart manually on changes)
pnpm start
```

### Production Build

**Purpose**: Optimized build for deployment with minimal footprint.

```bash
# Install production dependencies only
pnpm install --prod

# Build
pnpm run build
```

**Characteristics**:
- ✅ Source maps available (for debugging)
- ✅ Only production dependencies
- ✅ Smaller `node_modules/`
- ✅ Optimized for performance

**Production Docker Build** (reference from Dockerfile):
```dockerfile
# Build stage
FROM node:20-alpine as builder
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

# Install only production dependencies
RUN pnpm install --prod

# Runtime stage
FROM node:20-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./
CMD [ "node", "./src/index.js" ]
```

### Running After Build

**From Build Directory**:
```bash
# Default (uses pnpm start script)
pnpm start

# Direct node execution
node ./dist/src/index.js

# With environment variables
DISCORD_TOKEN=your_token node ./dist/src/index.js
```

**Setting up Production Environment**:
```bash
# Create .env file (see Environment Configuration)
cat > .env << 'EOF'
DISCORD_TOKEN=your_discord_bot_token
NODE_ENV=production
EOF

# Run with environment file
export $(cat .env | xargs) && pnpm start
```

---

## Path Alias Resolution

Quetza uses TypeScript path aliases for cleaner imports, which must be resolved to relative paths for runtime.

### What are Path Aliases?

Path aliases allow imports like:
```typescript
import logger from '@/lib/logger.js';
import config from '@config';
```

Instead of:
```typescript
import logger from '../../lib/logger.js';
import config from '../../config.js';
```

### Configuration

**config.tsconfig.json** (for config.ts):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@config": ["./config.ts"]
    }
  }
}
```

**src/tsconfig.json** (for src/):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./lib/*"],
      "@config": ["../config.ts"]
    }
  }
}
```

**modules/*/tsconfig.json** (for each module):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./lib/*"],
      "@config": ["../../config.ts"],
      "@core/*": ["../../src/lib/*"]
    }
  }
}
```

### tsc-alias Tool

The `tsc-alias` tool transforms compiled JavaScript:

**Before** (compiled but with path aliases):
```javascript
import logger from '@/lib/logger.js';
```

**After** (tsc-alias transformation):
```javascript
import logger from './lib/logger.js';
```

### Build Script Path Resolution

```bash
# build.sh handles multiple tsconfig files
for TS_CONFIG in ./config.tsconfig.json ./src/tsconfig.json ./modules/*/tsconfig.json; do
    pnpm exec tsc-alias -p "$TS_CONFIG"
done
```

**Why Multiple Configs?**:
- Each module/directory has different path resolution needs
- Enables modular builds
- Maintains clean import paths across codebase

### Troubleshooting Path Aliases

**Issue**: Module not found at runtime
```bash
# Verify tsc-alias ran
grep -r "@/" dist/

# Should return nothing (no aliases in compiled code)
# If it returns results, tsc-alias didn't run properly
```

**Issue**: Wrong relative paths
```bash
# Check compiled output
cat dist/src/index.js | grep "from"

# Verify paths are relative
# Should see: from './lib/...' or '../config.js'
# Should NOT see: from '@/...' or '@config'
```

**Solution**: Re-run build
```bash
pnpm run clean
pnpm run build
```

### Manual Path Alias Resolution

If `tsc-alias` isn't working:

```bash
# Run TypeScript compiler only
pnpm exec tsc --build

# Manually run tsc-alias
pnpm exec tsc-alias -p ./config.tsconfig.json
pnpm exec tsc-alias -p ./src/tsconfig.json
pnpm exec tsc-alias -p ./modules/core/tsconfig.json
pnpm exec tsc-alias -p ./modules/music/tsconfig.json
pnpm exec tsc-alias -p ./modules/ai/tsconfig.json
```

---

## Next Steps

- **[Environment Configuration](./03-environment-configuration.md)** - Set up environment variables
- **[External Dependencies](./04-external-dependencies.md)** - Install yt-dlp and FFmpeg
- **[Development Guide](../05-development-guide/)** - Learn development workflows

---

## Running the Bot

After successful build:

```bash
# Set required environment variables
export DISCORD_TOKEN=your_discord_bot_token

# Optional: AI module configuration
export LLAMA_API_URL=http://localhost:8080/v1
export LLAMA_MODEL=llama-3

# Start the bot
pnpm start
```

**Expected Output**:
```
[INFO] Loading modules...
[INFO] Module 'core' loaded
[INFO] Module 'music' loaded
[INFO] Module 'ai' loaded
[INFO] Logged in as YourBot#1234
```

---

## Comparison: Docker vs Source

| Aspect | Docker | Source |
|--------|--------|--------|
| Setup Time | ⚡ Fast (pull image) | 🐢 Slower (build from source) |
| Dependencies | ✅ Pre-installed | ❌ Manual installation |
| Updates | ✅ Pull new image | 🔧 Rebuild required |
| Customization | ❌ Limited | ✅ Full control |
| Development | ❌ Not ideal | ✅ Best option |
| Production | ✅ Recommended | ⚠️ Advanced users |

**Recommendation**:
- **Production**: Use Docker
- **Development**: Build from source
- **Custom Modules**: Build from source

---

[← Back to Section 2](./README.md) | [Next: Environment Configuration →](./03-environment-configuration.md)

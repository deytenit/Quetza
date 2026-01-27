# 2.3 Environment Configuration

Quetza's behavior is controlled through environment variables, enabling flexible configuration across different deployment scenarios without code changes. This guide covers all configuration options and best practices.

## Table of Contents

- [Environment Variables Overview](#environment-variables-overview)
- [Discord Token Setup](#discord-token-setup)
- [Llama API Configuration](#llama-api-configuration-ai-module)
- [Development Environment Variables](#development-environment-variables)
- [.env File Setup](#env-file-setup)
- [Security Best Practices](#security-best-practices)

---

## Environment Variables Overview

### Required Variables

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `DISCORD_TOKEN` | ✅ Yes | Discord bot authentication token | `MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhJKLM.nOpQrStUvWxYz...` |

### Optional Variables

| Variable | Required | Purpose | Default | Example |
|----------|----------|---------|---------|---------|
| `LLAMA_API_URL` | ❌ No | Llama API endpoint for AI module | `undefined` | `http://localhost:8080/v1` |
| `LLAMA_MODEL` | ❌ No | AI model identifier | `undefined` | `llama-3`, `gpt-4` |
| `NODE_ENV` | ❌ No | Runtime environment | `production` | `development`, `production` |

### Configuration Loading

Environment variables are loaded in `config.ts`:

```typescript
/** Discord bot token. */
const appToken = process.env.DISCORD_TOKEN;

/** AI module secrets. */
const llama = {
    apiUrl: process.env.LLAMA_API_URL,
    model: process.env.LLAMA_MODEL
};

/** Exported bundled configuration object. */
const config = {
    application: { token: appToken },
    llama
};
```

**What this means**:
- Variables are read at startup
- Undefined optional variables default to `undefined`
- Missing `DISCORD_TOKEN` will cause startup failure
- Changes require bot restart

---

## Discord Token Setup

The Discord token is the **only required** configuration for Quetza to function.

### Obtaining a Discord Bot Token

#### Step 1: Create Application

1. Navigate to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Enter application name (e.g., "Quetza")
4. Click **"Create"**

#### Step 2: Create Bot User

1. In your application, navigate to **"Bot"** tab (left sidebar)
2. Click **"Add Bot"**
3. Confirm by clicking **"Yes, do it!"**
4. Customize bot username and icon (optional)

#### Step 3: Get Token

1. Under **"TOKEN"** section, click **"Reset Token"**
2. Click **"Yes, do it!"** to confirm
3. **Copy the token immediately** - it won't be shown again
4. Store securely (see [Security Best Practices](#security-best-practices))

⚠️ **Warning**: Treat tokens like passwords. Never share or commit to version control.

#### Step 4: Configure Bot Settings

**Privileged Gateway Intents** (required for some features):

Navigate to **"Bot"** tab → **"Privileged Gateway Intents"**:

| Intent | Required | Purpose |
|--------|----------|---------|
| Presence Intent | ❌ No | See member presence updates |
| Server Members Intent | ❌ No | Access server member information |
| Message Content Intent | ⚠️ Recommended | Read message content (if needed by custom modules) |

**Bot Permissions**:

Quetza requires these permissions (set when creating invite link):

| Permission | Required | Purpose |
|------------|----------|---------|
| View Channels | ✅ Yes | See channels to respond in |
| Send Messages | ✅ Yes | Send command responses |
| Embed Links | ✅ Yes | Send rich embeds |
| Connect | ✅ Yes (Music) | Join voice channels |
| Speak | ✅ Yes (Music) | Play audio in voice channels |
| Use Voice Activity | ✅ Yes (Music) | Voice transmission |

#### Step 5: Invite Bot to Server

1. Navigate to **"OAuth2"** → **"URL Generator"**
2. Under **"SCOPES"**, select:
   - `bot`
   - `applications.commands` (for slash commands)
3. Under **"BOT PERMISSIONS"**, select required permissions (see above)
4. Copy the generated URL at the bottom
5. Open URL in browser and select server
6. Click **"Authorize"**

### Setting the Token

**Linux/macOS**:
```bash
export DISCORD_TOKEN="your_token_here"
```

**Windows (PowerShell)**:
```powershell
$env:DISCORD_TOKEN="your_token_here"
```

**Windows (CMD)**:
```cmd
set DISCORD_TOKEN=your_token_here
```

**Docker**:
```bash
docker run -e DISCORD_TOKEN=your_token_here deytenit/quetza:latest
```

**Docker Compose**:
```yaml
services:
  quetza:
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
```

### Verifying Token

**Test if token is valid**:

```bash
# Using curl (replace YOUR_TOKEN)
curl -H "Authorization: Bot YOUR_TOKEN" \
  https://discord.com/api/v10/users/@me

# Should return bot user information
# If error: "401 Unauthorized" - token is invalid
```

**Start Quetza and check logs**:
```bash
pnpm start

# Success:
# [INFO] Logged in as YourBot#1234

# Failure:
# [ERROR] Incorrect login details were provided.
```

### Token Rotation

If token is compromised:

1. Go to Developer Portal → Your Application → Bot
2. Click **"Reset Token"**
3. Update token in all deployments
4. Restart all bot instances

---

## Llama API Configuration (AI Module)

The AI module requires a Llama-compatible API endpoint to function. Without these variables, the AI module will not be available.

### What is Llama?

Llama is a family of large language models (LLMs) that can be run locally or via API. Quetza's AI module uses any OpenAI-compatible API endpoint.

### LLAMA_API_URL

**Purpose**: Specifies the base URL of your Llama API server.

**Format**: `http(s)://hostname:port/path`

**Examples**:
```bash
# Local llama.cpp server
export LLAMA_API_URL="http://localhost:8080/v1"

# Remote server
export LLAMA_API_URL="https://llama.example.com/v1"

# Docker service (in same network)
export LLAMA_API_URL="http://llama-api:8080/v1"

# OpenAI API (compatible)
export LLAMA_API_URL="https://api.openai.com/v1"
```

### LLAMA_MODEL

**Purpose**: Specifies which model to use for AI completions.

**Format**: Model identifier string (depends on your API provider)

**Examples**:
```bash
# Local llama.cpp (uses loaded model)
export LLAMA_MODEL="llama-3"

# OpenAI
export LLAMA_MODEL="gpt-4"
export LLAMA_MODEL="gpt-3.5-turbo"

# Custom model names
export LLAMA_MODEL="my-custom-model"
```

### Setting up Local Llama API

#### Using llama.cpp

**Option 1: Prebuilt Binary**

```bash
# Download llama.cpp server
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Build server
make server

# Download model (example: Llama 3)
wget https://huggingface.co/TheBloke/Llama-3-8B-GGUF/resolve/main/llama-3-8b.Q4_K_M.gguf

# Run server
./server -m llama-3-8b.Q4_K_M.gguf --host 0.0.0.0 --port 8080
```

**Option 2: Docker**

```bash
# Pull image
docker pull ghcr.io/ggerganov/llama.cpp:server

# Run with model
docker run -d \
  --name llama-api \
  -p 8080:8080 \
  -v ./models:/models \
  ghcr.io/ggerganov/llama.cpp:server \
  -m /models/llama-3-8b.Q4_K_M.gguf \
  --host 0.0.0.0 \
  --port 8080
```

**Configure Quetza**:
```bash
export LLAMA_API_URL="http://localhost:8080/v1"
export LLAMA_MODEL="llama-3"
```

#### Using Ollama

```bash
# Install Ollama (https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3

# Run Ollama server
ollama serve

# Configure Quetza
export LLAMA_API_URL="http://localhost:11434/v1"
export LLAMA_MODEL="llama3"
```

### Using OpenAI API

```bash
# Get API key from https://platform.openai.com/api-keys

export LLAMA_API_URL="https://api.openai.com/v1"
export LLAMA_MODEL="gpt-4"

# Note: Requires API key in request headers
# Quetza may need modification to support API keys
```

### Docker Compose with Llama API

```yaml
version: '3.8'

services:
  quetza:
    image: deytenit/quetza:latest
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - LLAMA_API_URL=http://llama-api:8080/v1
      - LLAMA_MODEL=llama-3
    depends_on:
      - llama-api

  llama-api:
    image: ghcr.io/ggerganov/llama.cpp:server
    ports:
      - "8080:8080"
    volumes:
      - ./models:/models
    command:
      - "-m"
      - "/models/llama-3-8b.Q4_K_M.gguf"
      - "--host"
      - "0.0.0.0"
      - "--port"
      - "8080"
```

### Verifying AI Module Configuration

**Check if API is accessible**:
```bash
# Test connection
curl http://localhost:8080/v1/models

# Should return list of available models
```

**Start Quetza and use AI commands**:
```bash
# In Discord, try:
/ask question: Hello, are you working?

# Should get AI-generated response
# If AI module not available, command won't exist
```

### AI Module Unavailable

If `LLAMA_API_URL` or `LLAMA_MODEL` is not set:
- AI module still loads but API calls will fail
- `/ask` and `/askclear` commands may not work
- Check logs for connection errors

---

## Development Environment Variables

### NODE_ENV

**Purpose**: Indicates runtime environment for conditional behavior.

**Values**:
- `production` (default): Production mode
- `development`: Development mode

**Setting**:
```bash
# Development
export NODE_ENV=development

# Production
export NODE_ENV=production
```

**Effects in Quetza**:

1. **Docker Image**: Sets `ENV NODE_ENV production` in Dockerfile
2. **Logging**: May affect log verbosity (depending on logger configuration)
3. **Source Maps**: Node.js can use source maps for better stack traces

**Usage in Code** (config.ts doesn't currently check it, but can be added):
```typescript
const isDev = process.env.NODE_ENV === 'development';
```

### Development-specific Variables

When developing, you might add custom variables:

```bash
# Development guild ID (for testing slash commands)
export DEV_GUILD_ID="912401672939139142"

# Enable debug logging
export DEBUG="quetza:*"

# Custom log level
export LOG_LEVEL="debug"
```

**Note**: These are examples. Quetza's current configuration doesn't use them, but you can extend `config.ts` to support them.

---

## .env File Setup

For local development, `.env` files provide convenient environment variable management.

### Creating a .env File

**Location**: Project root directory (`/home/runner/work/Quetza/Quetza/.env`)

```bash
# Create .env file
cat > .env << 'EOF'
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here

# AI Module Configuration (Optional)
LLAMA_API_URL=http://localhost:8080/v1
LLAMA_MODEL=llama-3

# Environment
NODE_ENV=development
EOF
```

### .env File Structure

```env
# Comment lines start with #

# Required
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhJKLM.nOpQrStUvWxYz...

# Optional - AI Module
LLAMA_API_URL=http://localhost:8080/v1
LLAMA_MODEL=llama-3

# Optional - Development
NODE_ENV=development

# Do not use quotes unless needed for special characters
# Good: DISCORD_TOKEN=abc123
# Bad:  DISCORD_TOKEN="abc123" (includes quotes in value)
```

### Loading .env Files

**Note**: Quetza doesn't currently use a `.env` loader like `dotenv`. You must manually load variables.

**Option 1: Export variables before running**:
```bash
# Load all variables from .env
export $(cat .env | grep -v '^#' | xargs)

# Run bot
pnpm start
```

**Option 2: Use dotenv (requires adding dependency)**:

1. Install dotenv:
   ```bash
   pnpm add dotenv
   ```

2. Modify `src/index.ts` to load `.env`:
   ```typescript
   import 'dotenv/config';  // Add at top
   import config from '@config';
   // ... rest of code
   ```

3. Run normally:
   ```bash
   pnpm start
   ```

**Option 3: Shell-specific loading**:

**Bash/Zsh**:
```bash
# Add to ~/.bashrc or ~/.zshrc
set -a
source /path/to/Quetza/.env
set +a
```

**Fish**:
```fish
# Add to ~/.config/fish/config.fish
export (cat /path/to/Quetza/.env | grep -v '^#' | xargs)
```

### .env with Docker

**Docker Run**:
```bash
docker run --env-file .env deytenit/quetza:latest
```

**Docker Compose**:
```yaml
services:
  quetza:
    env_file: .env
    # Or specify path
    env_file:
      - .env
      - .env.local
```

### Multiple Environment Files

```bash
# .env - default values
DISCORD_TOKEN=default_token
NODE_ENV=production

# .env.local - local overrides (add to .gitignore)
DISCORD_TOKEN=my_real_token_for_testing
NODE_ENV=development

# .env.production - production specific
DISCORD_TOKEN=${PROD_DISCORD_TOKEN}
LLAMA_API_URL=https://llama-prod.example.com/v1
```

**Loading order** (if using dotenv):
```javascript
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
```

### .gitignore for .env Files

**Always ignore environment files** with secrets:

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Allow example/template
!.env.example
```

### .env.example Template

Create a template for other developers:

```bash
# .env.example (safe to commit)
# Copy this to .env and fill in your values

# Discord Configuration (REQUIRED)
DISCORD_TOKEN=your_discord_bot_token

# AI Module Configuration (OPTIONAL)
LLAMA_API_URL=http://localhost:8080/v1
LLAMA_MODEL=llama-3

# Environment
NODE_ENV=development
```

---

## Security Best Practices

### Token Security

**DO**:
- ✅ Store tokens in environment variables or secret managers
- ✅ Use `.env` files for local development (and add to `.gitignore`)
- ✅ Rotate tokens regularly
- ✅ Use different tokens for development and production
- ✅ Restrict bot permissions to minimum required
- ✅ Enable 2FA on your Discord account

**DON'T**:
- ❌ **NEVER** commit tokens to version control
- ❌ **NEVER** share tokens in public channels/forums
- ❌ **NEVER** hardcode tokens in source code
- ❌ **NEVER** log tokens
- ❌ **NEVER** include tokens in error messages

### Checking for Leaked Tokens

**Search repository history**:
```bash
# Search all commits for token patterns
git log -p -S "DISCORD_TOKEN" --all

# Check if .env is tracked
git log --all --full-history -- .env
```

**If token is leaked**:
1. Immediately reset token in Discord Developer Portal
2. Update all deployments with new token
3. Remove token from git history:
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # DO NOT use 'git filter-branch' (deprecated)
   ```
4. Force push cleaned history (coordinate with team)
5. Consider rotating all secrets

### Environment Variable Validation

**Add validation to config.ts** (recommended):

```typescript
function validateConfig() {
    if (!process.env.DISCORD_TOKEN) {
        throw new Error('DISCORD_TOKEN is required but not set');
    }
    
    if (process.env.LLAMA_API_URL && !process.env.LLAMA_MODEL) {
        console.warn('LLAMA_API_URL set but LLAMA_MODEL not set - AI module may not work');
    }
}

validateConfig();
```

### Secret Management in Production

**For Production Deployments**:

**Docker Swarm Secrets**:
```bash
# Create secret
echo "your_token" | docker secret create discord_token -

# Use in service
docker service create \
  --name quetza \
  --secret discord_token \
  deytenit/quetza:latest
```

**Kubernetes Secrets**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: quetza-secrets
type: Opaque
stringData:
  discord-token: your_token_here
---
apiVersion: v1
kind: Pod
metadata:
  name: quetza
spec:
  containers:
  - name: quetza
    image: deytenit/quetza:latest
    env:
    - name: DISCORD_TOKEN
      valueFrom:
        secretKeyRef:
          name: quetza-secrets
          key: discord-token
```

**Environment Variable Services**:
- AWS Systems Manager Parameter Store
- HashiCorp Vault
- Azure Key Vault
- Google Cloud Secret Manager

### Auditing and Monitoring

**Log environment variable usage** (without values):
```typescript
import logger from '@/lib/logger.js';

logger.info('Configuration loaded', {
    discordToken: process.env.DISCORD_TOKEN ? 'Set' : 'Not set',
    llamaApiUrl: process.env.LLAMA_API_URL ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'production'
});
```

**Monitor for unauthorized access**:
- Review Discord audit logs regularly
- Check for unexpected bot activity
- Monitor bot's server list for unauthorized joins

---

## Environment Variable Reference

### Complete List

| Variable | Required | Type | Default | Purpose |
|----------|----------|------|---------|---------|
| `DISCORD_TOKEN` | ✅ | String | None | Bot authentication token |
| `LLAMA_API_URL` | ❌ | URL | `undefined` | Llama API base URL |
| `LLAMA_MODEL` | ❌ | String | `undefined` | AI model identifier |
| `NODE_ENV` | ❌ | String | `production` | Runtime environment |

### Validation Checklist

Before starting Quetza:

- [ ] `DISCORD_TOKEN` is set and valid
- [ ] If using AI: `LLAMA_API_URL` is accessible
- [ ] If using AI: `LLAMA_MODEL` matches available model
- [ ] `.env` file is in `.gitignore`
- [ ] No tokens in git history
- [ ] Tokens are not logged or exposed

---

## Next Steps

- **[External Dependencies](./04-external-dependencies.md)** - Set up yt-dlp and FFmpeg
- **[Docker Deployment](./01-docker-deployment.md)** - Deploy with Docker
- **[Source Installation](./02-source-installation.md)** - Build from source

---

## Troubleshooting

### Bot Won't Start

```bash
# Check if DISCORD_TOKEN is set
echo $DISCORD_TOKEN

# If empty, set it
export DISCORD_TOKEN=your_token

# Verify token format (should be long base64-like string)
# Format: MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhJKLM.nOpQrStUvWxYz...
```

### AI Module Not Working

```bash
# Check Llama API is running
curl http://localhost:8080/v1/models

# Check variables are set
echo $LLAMA_API_URL
echo $LLAMA_MODEL

# Check Quetza can reach API
docker exec quetza curl http://llama-api:8080/v1/models
```

### Environment Variables Not Loading

```bash
# Verify .env file exists
cat .env

# Check variables are exported
env | grep DISCORD

# Reload environment
export $(cat .env | grep -v '^#' | xargs)
pnpm start
```

---

[← Back to Section 2](./README.md) | [Next: External Dependencies →](./04-external-dependencies.md)

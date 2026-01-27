# Quick Start Guide

This guide will help you get Quetza up and running quickly. Choose your preferred installation method: Docker (recommended) or from source.

## Prerequisites

Before installing Quetza, ensure you have the following:

### 1. Discord Bot Token

You need a Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications).

**Steps to create a bot:**

1. Go to https://discord.com/developers/applications
2. Click "New Application" and give it a name (e.g., "Quetza")
3. Navigate to the "Bot" section in the left sidebar
4. Click "Add Bot" and confirm
5. Under the bot's username, click "Reset Token" and copy the token
6. **Important**: Keep this token secure! Never share it or commit it to version control

**Required Bot Permissions:**
- `Send Messages`
- `Embed Links`
- `Connect` (for music)
- `Speak` (for music)
- `Use Voice Activity` (for music)

**Required Intents** (enable in the Discord Developer Portal):
- `Server Members Intent`
- `Message Content Intent`

### 2. Invite the Bot to Your Server

Generate an invite URL with the proper scopes and permissions:

1. In the Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions (as listed above)
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### 3. Installation Requirements

Choose your installation method:

**For Docker Installation:**
- [Docker](https://docs.docker.com/get-docker/) installed on your system
- Docker Compose (optional, for easier management)

**For Source Installation:**
- [Node.js 22.x.x](https://nodejs.org/) installed
- [pnpm](https://pnpm.io/) package manager installed globally: `npm install -g pnpm`

## Installation (Docker)

Docker is the **recommended** method for running Quetza. It bundles all dependencies and ensures consistent behavior across platforms.

### Method 1: Docker Run (Quick)

The fastest way to get started:

```bash
docker run \
  -e DISCORD_TOKEN='your_discord_token_here' \
  --name quetza \
  -d \
  unknowableshade/quetza-bot:latest
```

**Optional: Add AI Module Support**

If you have a Llama API endpoint:

```bash
docker run \
  -e DISCORD_TOKEN='your_discord_token_here' \
  -e LLAMA_API_URL='http://your-llama-server:8080' \
  -e LLAMA_MODEL='llama-3.2-1b' \
  --name quetza \
  -d \
  unknowableshade/quetza-bot:latest
```

### Method 2: Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  quetza:
    image: unknowableshade/quetza-bot:latest
    container_name: quetza
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=your_discord_token_here
      # Optional: AI module configuration
      # - LLAMA_API_URL=http://your-llama-server:8080
      # - LLAMA_MODEL=llama-3.2-1b
    volumes:
      - ./logs:/usr/src/app/log
```

Then start the bot:

```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f quetza
```

**Stop the bot:**
```bash
docker-compose down
```

**Update to the latest version:**
```bash
docker-compose pull
docker-compose up -d
```

### Verifying Docker Installation

Check that the container is running:

```bash
docker ps | grep quetza
```

View the logs to ensure the bot started successfully:

```bash
docker logs quetza
```

You should see log messages indicating the bot is connecting to Discord and registering commands.

## Installation (From Source)

For development or when you need more control, you can run Quetza from source.

### Step 1: Clone the Repository

```bash
git clone https://github.com/deytenit/Quetza.git
cd Quetza
```

### Step 2: Install Dependencies

**Important**: Quetza uses **pnpm** as its package manager.

```bash
pnpm install
```

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

### Step 3: Install External Dependencies

The Music module requires `yt-dlp` and `ffmpeg`.

**yt-dlp Installation:**

Linux/macOS:
```bash
# Download yt-dlp to the bin directory
mkdir -p bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod a+rx bin/yt-dlp
```

Windows:
```bash
# Download yt-dlp.exe to the bin directory
mkdir bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe -o bin/yt-dlp.exe
```

Or install system-wide via your package manager.

**FFmpeg Installation:**

Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install ffmpeg
```

macOS (Homebrew):
```bash
brew install ffmpeg
```

Windows:
Download from https://ffmpeg.org/download.html and add to your PATH.

### Step 4: Build the Project

Compile TypeScript to JavaScript:

```bash
pnpm run build
```

This command:
1. Compiles all TypeScript files
2. Resolves path aliases
3. Outputs to the `dist/` directory

### Step 5: Configure Environment Variables

Create a `.env` file in the project root (or set environment variables):

```bash
DISCORD_TOKEN=your_discord_token_here
```

**Optional - AI Module:**
```bash
LLAMA_API_URL=http://localhost:8080
LLAMA_MODEL=llama-3.2-1b
```

**Alternatively**, export environment variables in your shell:

```bash
export DISCORD_TOKEN='your_discord_token_here'
export LLAMA_API_URL='http://localhost:8080'
export LLAMA_MODEL='llama-3.2-1b'
```

### Step 6: Run Quetza

```bash
pnpm start
```

Or directly with Node.js:

```bash
node dist/src/index.js
```

### Verifying Source Installation

Check the console output for:
- "Client is ready!" message
- List of loaded modules
- Command registration confirmation

## First-Time Setup

After installing Quetza, it will automatically:

1. **Connect to Discord** using your bot token
2. **Register slash commands** with the Discord API
3. **Initialize modules** (Core, Music, and AI if configured)
4. **Report status** in the console/logs

The bot should appear online in your Discord server within a few seconds.

## Basic Configuration

Quetza works out of the box with minimal configuration. The only required environment variable is:

- `DISCORD_TOKEN` - Your Discord bot token

### Optional Configuration

**AI Module** (requires a Llama API server):
- `LLAMA_API_URL` - URL to your Llama API endpoint (e.g., `http://localhost:8080`)
- `LLAMA_MODEL` - Model name to use (e.g., `llama-3.2-1b`)

**Development Mode** (defined in `config.ts`):
- Test guild ID for command testing (hardcoded in config, can be modified)

### Configuration File

The bot's configuration is defined in `config.ts` at the project root. It includes:

- **Path Configuration**: Directories for modules, binaries, and logs
- **Application Settings**: Bot activity status and colors for embeds
- **Module Settings**: AI module configuration from environment variables

To customize, edit `config.ts` and rebuild:

```bash
pnpm run build
```

## Running Your First Command

Once Quetza is running, try these commands in your Discord server:

### 1. Test Basic Functionality

```
/ping
```

This command checks if the bot is responsive and shows latency information.

### 2. View Available Modules

```
/modules
```

This displays all loaded modules and their descriptions:
- **core**: Quetza's core functionality
- **music**: Music playback module
- **ai**: AI conversational module (if configured)

### 3. Play Music

First, join a voice channel, then:

```
/play query:Never Gonna Give You Up
```

The bot will:
1. Join your voice channel
2. Search for the song on YouTube
3. Add it to the queue
4. Start playing

**View the queue:**
```
/queue
```

**Pause playback:**
```
/pause
```

**Resume playback:**
```
/pause
```

**Stop and disconnect:**
```
/stop
```

### 4. Chat with AI (if configured)

```
/ask question:What is the meaning of life?
```

The AI will respond based on your Llama model. Conversation history is maintained per user.

**Clear conversation history:**
```
/askclear
```

## Troubleshooting First Run

### Bot Not Appearing Online

- Verify your `DISCORD_TOKEN` is correct
- Check bot permissions in Discord Developer Portal
- Ensure required intents are enabled (Server Members, Message Content)
- Review logs for connection errors

### Commands Not Appearing

- Wait a few minutes for Discord to propagate slash commands
- Try in a different channel
- Re-invite the bot with proper scopes (`bot` + `applications.commands`)
- Check console for command registration errors

### Music Not Playing

- Ensure `yt-dlp` is installed and accessible
- Verify `ffmpeg` is installed system-wide or in PATH
- Check that the bot has voice permissions in the channel
- Ensure you're in a voice channel when using `/play`

### AI Commands Not Working

- Verify `LLAMA_API_URL` and `LLAMA_MODEL` are set correctly
- Ensure your Llama server is running and accessible
- Check logs for connection errors to the AI service

### Permission Errors

- Review bot permissions in server settings
- Ensure the bot role has required permissions
- Check channel-specific permission overrides

## Next Steps

Now that Quetza is running, you can:

- **Explore Features**: Try all the [Music Module Commands](../04-modules/02-music-module.md)
- **Configure Advanced Settings**: See [Environment Configuration](../02-installation-deployment/03-environment-configuration.md)
- **Learn the Architecture**: Read the [Core Architecture](../03-core-architecture/) section
- **Create Custom Modules**: Follow the [Development Guide](../05-development-guide/)
- **Deploy to Production**: Set up [Docker Compose](../02-installation-deployment/01-docker-deployment.md) with proper volume management

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](../07-user-guide/05-troubleshooting.md)
2. Review the [FAQ](../14-appendices/05-faq.md)
3. Open an issue on [GitHub](https://github.com/deytenit/Quetza/issues)
4. Check the application logs in the `log/` directory

---

Congratulations! You now have Quetza running on your Discord server. Enjoy exploring its features!

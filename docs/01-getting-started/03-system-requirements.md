# System Requirements

This document outlines the system requirements for running Quetza in various configurations.

## Node.js and Runtime Requirements

### Node.js Version

**Required**: Node.js **22.x.x**

Quetza is built and tested with Node.js 22.x. While other versions may work, they are not officially supported.

**Verify your Node.js version:**
```bash
node --version
# Should output: v22.x.x
```

**Install or update Node.js:**
- **Official website**: https://nodejs.org/
- **Version manager (recommended)**: [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)

Using nvm:
```bash
nvm install 22
nvm use 22
```

### Package Manager

**Required**: pnpm

Quetza uses `pnpm` as its package manager for improved performance and disk space efficiency.

**Install pnpm:**
```bash
npm install -g pnpm
```

**Verify installation:**
```bash
pnpm --version
```

**Why pnpm?**
- Faster installation compared to npm/yarn
- Efficient disk space usage with content-addressable storage
- Strict dependency resolution prevents phantom dependencies
- The project includes a `preinstall` hook that enforces pnpm usage

### TypeScript

**Version**: 5.6.3 (included as dev dependency)

TypeScript is required for building from source but is automatically installed when you run `pnpm install`.

### Runtime Environment

**Supported Module System**: ES Modules (ESM)

Quetza is built as an ES module project. The `package.json` specifies `"type": "module"`, and all imports use ES6 module syntax.

**Node.js Features Used:**
- ES Modules (`import`/`export`)
- Top-level `await`
- URL and Path utilities (`fileURLToPath`, `dirname`)
- Environment variables (`process.env`)

## External Dependencies

Quetza requires several external binaries and services depending on which modules you enable.

### Required for All Installations

**None** - The base bot (Core module) has no external dependencies beyond Node.js.

### Required for Music Module

#### 1. yt-dlp

**Purpose**: Download and extract audio from YouTube, SoundCloud, and other platforms.

**Version**: Latest recommended

**Installation Methods:**

**Linux:**
```bash
# Download to project bin directory
mkdir -p bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod a+rx bin/yt-dlp
```

**Or system-wide:**
```bash
# Ubuntu/Debian
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Using pip
python3 -m pip install -U yt-dlp
```

**macOS:**
```bash
# Homebrew
brew install yt-dlp

# Or download manually
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod a+rx bin/yt-dlp
```

**Windows:**
```bash
# Download to project bin directory
mkdir bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe -o bin/yt-dlp.exe
```

**Or system-wide:**
- Download from https://github.com/yt-dlp/yt-dlp/releases
- Add to your system PATH

**Verify installation:**
```bash
yt-dlp --version
# Or if installed in bin/:
./bin/yt-dlp --version
```

**Configuration:**

Quetza looks for yt-dlp in the following locations (in order):
1. `<project_root>/bin/yt-dlp`
2. System PATH

#### 2. FFmpeg

**Purpose**: Audio encoding, decoding, and filter application.

**Version**: Any recent version (4.0+)

**Installation Methods:**

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Linux (Fedora):**
```bash
sudo dnf install ffmpeg
```

**macOS:**
```bash
# Homebrew
brew install ffmpeg
```

**Windows:**
1. Download from https://ffmpeg.org/download.html
2. Extract to a directory
3. Add the `bin` folder to your system PATH

**Or use Chocolatey:**
```bash
choco install ffmpeg
```

**Verify installation:**
```bash
ffmpeg -version
```

**Required FFmpeg Features:**
- Audio codec support (AAC, MP3, Opus)
- Audio filters (for filter module features)
- Pipe input/output

### Required for AI Module

#### Llama API Server

**Purpose**: Provides LLM-based conversational AI capabilities.

**Requirements:**
- A running Llama API server compatible with OpenAI-style API
- Accessible via HTTP/HTTPS
- Supports `/v1/chat/completions` endpoint

**Example Compatible Servers:**
- [llama.cpp server](https://github.com/ggerganov/llama.cpp)
- [Ollama](https://ollama.ai/) with OpenAI compatibility
- [text-generation-webui](https://github.com/oobabooga/text-generation-webui) with API extension
- [LocalAI](https://localai.io/)

**Configuration:**

Set environment variables:
```bash
export LLAMA_API_URL='http://localhost:8080'  # Your Llama server URL
export LLAMA_MODEL='llama-3.2-1b'             # Model name
```

**Note**: The AI module is **optional**. If not configured, the bot will run without AI commands.

## Hardware Requirements

### Minimum Requirements

These are the bare minimum requirements to run Quetza:

**CPU**: 
- 1 core / 2 threads
- x86_64 or ARM64 architecture

**RAM**: 
- 256 MB for base bot (Core module only)
- 512 MB with Music module
- 1 GB with Music and AI modules (excluding AI server)

**Disk Space**:
- 200 MB for Docker image
- 500 MB for source installation (including node_modules)
- Additional space for logs (minimal, rotates automatically)

**Network**:
- Stable internet connection for Discord Gateway
- Minimum 1 Mbps upload/download for music streaming
- Low latency preferred (<200ms to Discord servers)

### Recommended Requirements

For optimal performance, especially with multiple guilds or heavy music usage:

**CPU**: 
- 2 cores / 4 threads
- Modern x86_64 processor (2015 or newer)

**RAM**: 
- 512 MB for Core module
- 1 GB with Music module
- 2 GB with Music and AI modules
- 4 GB+ if running Llama server on the same machine

**Disk Space**:
- 1 GB for application and dependencies
- 5-10 GB if running local AI models
- SSD recommended for better performance

**Network**:
- 5 Mbps upload/download for smooth music streaming
- <100ms latency to Discord servers

### Performance Considerations

**Music Module:**
- CPU usage increases with concurrent voice channels
- Each active player uses ~30-50 MB RAM
- Applying audio filters increases CPU usage
- Downloading/streaming uses network bandwidth

**AI Module:**
- AI responses depend entirely on your Llama server performance
- The bot itself only makes HTTP requests to the AI server
- Consider hosting the AI server separately for better resource allocation

**Scaling:**
- Each additional guild adds minimal overhead
- Concurrent voice connections scale linearly with RAM/CPU
- Log file writes are asynchronous and have minimal impact

## Supported Platforms

### Operating Systems

Quetza is developed and tested on **Linux** but supports multiple platforms:

#### Linux (Recommended)
- ✅ **Ubuntu 20.04+** (Fully tested)
- ✅ **Debian 11+** (Fully tested)
- ✅ **Fedora 35+** (Compatible)
- ✅ **Arch Linux** (Compatible)
- ✅ **Alpine Linux** (Docker image base)
- ⚠️ Other distributions should work but are not officially tested

#### macOS
- ✅ **macOS 11 (Big Sur)+** (Compatible)
- Requires Homebrew for dependencies (ffmpeg, yt-dlp)
- ARM64 (M1/M2) and x86_64 supported

#### Windows
- ⚠️ **Windows 10/11** (Compatible with limitations)
- Requires manual installation of ffmpeg and yt-dlp
- WSL2 recommended for better compatibility
- Path handling may differ; use Windows-style paths

**Recommendation**: For production deployments, use **Linux** or **Docker** for the best experience.

### Virtualization and Containers

#### Docker (Highly Recommended)
- ✅ **Docker 20.10+**
- ✅ **Docker Compose 1.29+** (optional but recommended)
- Supports both AMD64 and ARM64 architectures
- Pre-built images available at [Docker Hub](https://hub.docker.com/repository/docker/unknowableshade/quetza-bot)

**Benefits:**
- All dependencies bundled
- Consistent environment across platforms
- Easy updates and rollbacks
- Automatic inclusion of yt-dlp and ffmpeg

#### Virtual Machines
- ✅ Works on any hypervisor (VMware, VirtualBox, KVM, etc.)
- Treat as a standard Linux installation
- Allocate resources based on requirements above

#### Cloud Platforms
- ✅ **AWS EC2** (tested)
- ✅ **Google Cloud Compute** (compatible)
- ✅ **Azure Virtual Machines** (compatible)
- ✅ **DigitalOcean Droplets** (compatible)
- ✅ **Heroku** (compatible with buildpack modifications)
- ✅ **Railway** (compatible)

**Note**: Some cloud platforms may have restrictions on audio streaming or require additional configuration.

### Architecture Support

**x86_64 (AMD64)**: ✅ Fully supported and tested

**ARM64 (AArch64)**: ✅ Supported
- Raspberry Pi 4 (4GB+ RAM recommended)
- Apple Silicon (M1/M2 Macs)
- AWS Graviton instances
- Docker multi-arch images available

**ARM32**: ⚠️ Not officially supported
- May work on Raspberry Pi 3 with manual compilation
- Not recommended due to limited resources

## Development Environment

If you plan to develop modules or contribute to Quetza, additional tools are recommended:

### Recommended Development Tools

**Code Editor:**
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)
  - TypeScript and ESLint extensions
  - Prettier extension
  - GitLens extension

**Version Control:**
- Git 2.30+

**Additional Node.js Tools:**
- `tsc-alias` (included as dev dependency)
- ESLint and Prettier (included as dev dependencies)

**Optional:**
- Docker Desktop (for testing Docker builds locally)
- Mocha (included for testing)

### Development System Requirements

**RAM**: 2 GB+ (4 GB recommended for comfortable development)

**Disk Space**: 2 GB+ (for node_modules, IDE, and build artifacts)

**CPU**: Any modern processor (development involves TypeScript compilation)

## Dependency Check Script

To verify all dependencies are properly installed, you can run:

```bash
# Check Node.js
node --version

# Check pnpm
pnpm --version

# Check yt-dlp (Music module)
yt-dlp --version

# Check ffmpeg (Music module)
ffmpeg -version

# Check if Llama API is accessible (AI module)
curl http://localhost:8080/v1/models
```

## Updating Requirements

As Quetza evolves, requirements may change. Always check:
- `package.json` for Node.js engine requirements
- `Dockerfile` for Alpine Linux and system dependencies
- Release notes for breaking changes

---

**Next Steps:**
- Return to [Quick Start Guide](./02-quick-start-guide.md) to install Quetza
- See [Docker Deployment](../02-installation-deployment/01-docker-deployment.md) for advanced Docker setup
- Review [External Dependencies Setup](../02-installation-deployment/04-external-dependencies-setup.md) for detailed dependency configuration

# Section 2: Installation & Deployment

This section provides comprehensive guides for deploying Quetza using various methods, from Docker containers to building from source.

## 📋 Table of Contents

1. **[Docker Deployment](./01-docker-deployment.md)** - Recommended deployment method
2. **[Source Installation](./02-source-installation.md)** - Building and running from source
3. **[Environment Configuration](./03-environment-configuration.md)** - Environment variables and secrets
4. **[External Dependencies](./04-external-dependencies.md)** - yt-dlp and FFmpeg setup

---

## 🎯 Quick Navigation

### For Production Deployment

**Recommended**: [Docker Deployment](./01-docker-deployment.md)

→ Fast setup with pre-configured dependencies  
→ Consistent environment across platforms  
→ Automatic updates via image tags

**What you'll need**:
- Docker installed
- Discord bot token
- 5 minutes

### For Development

**Recommended**: [Source Installation](./02-source-installation.md)

→ Full control over build process  
→ Easy code modifications  
→ Best for custom modules

**What you'll need**:
- Node.js 22.x
- pnpm package manager
- Discord bot token
- yt-dlp and FFmpeg

---

## 📚 Section Overview

### 2.1 Docker Deployment

Learn how to deploy Quetza using Docker, the recommended method for production environments.

**Topics Covered**:
- Using pre-built images from Docker Hub
- Docker run configuration and options
- Docker Compose setup for multi-container deployments
- Volume management for persistent logs
- Container networking for AI module integration
- Multi-platform support (AMD64/ARM64)

**Best for**: 
- Production deployments
- Quick setup
- Consistent environments
- Users new to Quetza

[**Read Docker Deployment Guide →**](./01-docker-deployment.md)

---

### 2.2 Source Installation

Build Quetza from source for development or customization.

**Topics Covered**:
- Cloning the repository
- Installing dependencies with pnpm
- Building TypeScript source code
- Development vs production builds
- Path alias resolution with tsc-alias

**Best for**:
- Development workflows
- Custom module creation
- Contributing to Quetza
- Learning the codebase

[**Read Source Installation Guide →**](./02-source-installation.md)

---

### 2.3 Environment Configuration

Configure Quetza through environment variables for different deployment scenarios.

**Topics Covered**:
- Environment variables overview
- Obtaining and configuring Discord tokens
- Setting up Llama API for AI module
- Development environment configuration
- Creating and managing .env files
- Security best practices for secrets

**Best for**:
- All deployment methods
- Understanding configuration options
- Securing sensitive data
- Multi-environment setups

[**Read Environment Configuration Guide →**](./03-environment-configuration.md)

---

### 2.4 External Dependencies

Set up external tools required by the Music module.

**Topics Covered**:
- Installing yt-dlp for audio downloading
- Configuring FFmpeg for audio processing
- Binary path configuration
- Dependency verification and troubleshooting

**Best for**:
- Source installations
- Troubleshooting music playback
- Understanding Music module requirements
- Custom binary paths

[**Read External Dependencies Guide →**](./04-external-dependencies.md)

---

## 🚀 Deployment Scenarios

### Scenario 1: Quick Production Deployment

**Goal**: Get Quetza running in production as fast as possible

**Steps**:
1. Install Docker
2. Get Discord bot token
3. Run: `docker run -e DISCORD_TOKEN=your_token deytenit/quetza:latest`

**Guides**: [Docker Deployment](./01-docker-deployment.md) + [Environment Configuration](./03-environment-configuration.md)

---

### Scenario 2: Production with AI Module

**Goal**: Deploy Quetza with full AI capabilities

**Steps**:
1. Set up Llama API server
2. Create docker-compose.yml
3. Configure environment variables
4. Deploy with `docker-compose up -d`

**Guides**: [Docker Deployment](./01-docker-deployment.md#with-ai-module-llama-integration) + [Environment Configuration](./03-environment-configuration.md#llama-api-configuration-ai-module)

---

### Scenario 3: Development Environment

**Goal**: Set up local development environment

**Steps**:
1. Clone repository
2. Install pnpm and dependencies
3. Install yt-dlp and FFmpeg
4. Build and run from source

**Guides**: [Source Installation](./02-source-installation.md) + [External Dependencies](./04-external-dependencies.md)

---

### Scenario 4: Raspberry Pi Deployment

**Goal**: Run Quetza on ARM64 device

**Steps**:
1. Install Docker on Raspberry Pi
2. Pull ARM64 image (automatic platform detection)
3. Run with environment variables

**Guides**: [Docker Deployment](./01-docker-deployment.md#multi-platform-support)

---

## 📊 Deployment Method Comparison

| Feature | Docker | Source |
|---------|--------|--------|
| **Setup Time** | ⚡ 5 minutes | 🐢 15-30 minutes |
| **Dependencies** | ✅ Pre-installed | ❌ Manual install |
| **Updates** | ✅ Pull new image | 🔧 Git pull + rebuild |
| **Customization** | ⚠️ Limited | ✅ Full control |
| **Development** | ❌ Not ideal | ✅ Recommended |
| **Production** | ✅ Recommended | ⚠️ Advanced users |
| **Cross-platform** | ✅ AMD64/ARM64 | ⚠️ Platform-dependent |
| **Isolation** | ✅ Containerized | ❌ Runs on host |
| **Resource Usage** | 🔹 Slightly higher | 🔹 Lower |

---

## 🛠️ Prerequisites

### For Docker Deployment

**Required**:
- Docker Engine 20.10+ or Docker Desktop
- Discord bot token

**Optional**:
- Docker Compose (for multi-container setups)
- Llama API server (for AI module)

**Installation Guides**:
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Desktop](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

### For Source Installation

**Required**:
- Node.js 22.x ([download](https://nodejs.org/))
- pnpm ([installation](https://pnpm.io/installation))
- Discord bot token
- yt-dlp ([installation](./04-external-dependencies.md#yt-dlp-installation))
- FFmpeg ([installation](./04-external-dependencies.md#ffmpeg-configuration))

**Optional**:
- Git (for cloning repository)
- Python 3.7+ (for yt-dlp)

---

## 🔐 Security Considerations

Before deploying Quetza, review security best practices:

- **Never commit tokens to version control**
- **Use environment variables for secrets**
- **Restrict bot permissions to minimum required**
- **Keep dependencies updated**
- **Use different tokens for dev/prod**
- **Enable 2FA on Discord account**

See [Environment Configuration - Security Best Practices](./03-environment-configuration.md#security-best-practices) for details.

---

## 🔍 Quick Reference

### Essential Environment Variables

```bash
# Required
DISCORD_TOKEN=your_discord_bot_token

# Optional - AI Module
LLAMA_API_URL=http://localhost:8080/v1
LLAMA_MODEL=llama-3

# Optional - Environment
NODE_ENV=production
```

### Docker Quick Start

```bash
# Pull latest image
docker pull deytenit/quetza:latest

# Run container
docker run -e DISCORD_TOKEN=your_token --name quetza -d deytenit/quetza:latest

# View logs
docker logs -f quetza
```

### Source Quick Start

```bash
# Clone repository
git clone https://github.com/deytenit/Quetza.git
cd Quetza

# Install dependencies
pnpm install

# Build
pnpm run build

# Run
export DISCORD_TOKEN=your_token
pnpm start
```

---

## 🐛 Troubleshooting

### Common Issues

**Bot won't start**:
- ✅ Check `DISCORD_TOKEN` is set correctly
- ✅ Verify token is valid at Discord Developer Portal
- ✅ Check logs for specific error messages

**Music not playing**:
- ✅ Verify yt-dlp is installed and accessible
- ✅ Check FFmpeg is installed and in PATH
- ✅ Test dependencies with verification script

**AI module not working**:
- ✅ Ensure `LLAMA_API_URL` is set and accessible
- ✅ Verify `LLAMA_MODEL` matches available model
- ✅ Check Llama API server is running

**Docker-specific issues**:
- ✅ Check container is running: `docker ps`
- ✅ View logs: `docker logs quetza`
- ✅ Verify image pulled successfully: `docker images`

See individual guides for detailed troubleshooting sections.

---

## 📖 Related Documentation

### Previous Section
- [**← Section 1: Getting Started**](../01-getting-started/) - Introduction and quick start

### Next Sections
- [**Section 3: Core Architecture →**](../03-core-architecture/) - Understanding Quetza's design
- [**Section 4: Modules →**](../04-modules/) - Module-specific documentation
- [**Section 5: Development Guide →**](../05-development-guide/) - Creating custom modules

---

## 📝 Feedback

Found an issue with these guides? Have suggestions for improvements?

- **Report issues**: [GitHub Issues](https://github.com/deytenit/Quetza/issues)
- **Contribute**: [Contributing Guide](../10-contributing/)
- **Ask questions**: [GitHub Discussions](https://github.com/deytenit/Quetza/discussions)

---

## 🎓 Learning Path

**New to Quetza?** Follow this recommended learning path:

1. ✅ [Getting Started - Introduction](../01-getting-started/01-introduction.md)
2. ✅ [Getting Started - Quick Start](../01-getting-started/02-quick-start-guide.md)
3. 📍 **You are here** - Installation & Deployment
4. ⏭️ [Core Architecture](../03-core-architecture/) - Understanding the system
5. ⏭️ [Development Guide](../05-development-guide/) - Building custom features

---

**Ready to deploy?** Choose your path:

- [**Docker Deployment** (Recommended) →](./01-docker-deployment.md)
- [**Source Installation** (Developers) →](./02-source-installation.md)

---

[← Back to Main Documentation](../README.md)

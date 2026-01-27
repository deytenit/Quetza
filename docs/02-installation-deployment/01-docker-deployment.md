# 2.1 Docker Deployment

Docker is the **recommended deployment method** for Quetza. It provides a consistent, isolated environment with all dependencies pre-configured, making deployment simple and reliable across different platforms.

## Table of Contents

- [Using Pre-built Images](#using-pre-built-images)
- [Docker Run Configuration](#docker-run-configuration)
- [Docker Compose Setup](#docker-compose-setup)
- [Volume Management](#volume-management)
- [Container Networking](#container-networking)
- [Multi-platform Support](#multi-platform-support)

---

## Using Pre-built Images

Quetza's official Docker images are automatically built and published to Docker Hub through GitHub Actions CI/CD pipeline. These images are production-ready and include all necessary dependencies.

### Available Images

**Docker Hub Repository**: [`deytenit/quetza`](https://hub.docker.com/r/deytenit/quetza)

### Image Tags

| Tag | Description | Use Case |
|-----|-------------|----------|
| `latest` | Latest stable release from a git tag (without pre-release identifiers) | Production deployments |
| `latest-dev` | Latest development build from master branch | Testing latest features |
| `<version>` | Specific version tag (e.g., `2024.11.0`) | Version pinning for stability |
| `<git-sha>` | Build from specific commit | Development and debugging |

### Pulling an Image

```bash
# Pull latest stable version
docker pull deytenit/quetza:latest

# Pull specific version
docker pull deytenit/quetza:2024.11.0

# Pull latest development build
docker pull deytenit/quetza:latest-dev
```

### Image Architecture

Pre-built images support both **AMD64** and **ARM64** architectures, enabling deployment on:

- x86_64 servers and workstations
- ARM-based systems (Raspberry Pi, AWS Graviton, Apple Silicon with Docker Desktop)

Docker automatically selects the correct architecture for your platform.

---

## Docker Run Configuration

The simplest way to run Quetza is using `docker run` with the necessary environment variables.

### Basic Usage

```bash
docker run \
  -e DISCORD_TOKEN=your_discord_bot_token \
  --name quetza \
  -d \
  deytenit/quetza:latest
```

**Flags Explained**:
- `-e DISCORD_TOKEN=...` - Provides the Discord bot token (required)
- `--name quetza` - Names the container for easier management
- `-d` - Runs container in detached mode (background)

### Full Configuration Example

```bash
docker run \
  -e DISCORD_TOKEN=your_discord_bot_token \
  -e LLAMA_API_URL=http://localhost:8080/v1 \
  -e LLAMA_MODEL=llama-3 \
  -v quetza-logs:/usr/src/app/log \
  --name quetza \
  --restart unless-stopped \
  -d \
  deytenit/quetza:latest
```

**Additional Options**:
- `-e LLAMA_API_URL=...` - Llama API endpoint for AI module (optional)
- `-e LLAMA_MODEL=...` - AI model to use (optional)
- `-v quetza-logs:/usr/src/app/log` - Persist log files
- `--restart unless-stopped` - Auto-restart policy

### Viewing Logs

```bash
# View live logs
docker logs -f quetza

# View last 100 lines
docker logs --tail 100 quetza

# View logs with timestamps
docker logs -t quetza
```

### Managing the Container

```bash
# Stop the container
docker stop quetza

# Start the container
docker start quetza

# Restart the container
docker restart quetza

# Remove the container
docker rm quetza

# Remove container and volumes
docker rm -v quetza
```

---

## Docker Compose Setup

Docker Compose is recommended for production deployments as it provides declarative configuration and easier management of multi-container setups.

### Basic docker-compose.yml

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  quetza:
    image: deytenit/quetza:latest
    container_name: quetza
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
    volumes:
      - quetza-logs:/usr/src/app/log

volumes:
  quetza-logs:
```

### With AI Module (Llama Integration)

```yaml
version: '3.8'

services:
  quetza:
    image: deytenit/quetza:latest
    container_name: quetza
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - LLAMA_API_URL=http://llama-api:8080/v1
      - LLAMA_MODEL=llama-3
    volumes:
      - quetza-logs:/usr/src/app/log
    depends_on:
      - llama-api

  llama-api:
    image: ghcr.io/ggerganov/llama.cpp:server
    container_name: llama-api
    restart: unless-stopped
    volumes:
      - ./models:/models
    command: 
      - "--host"
      - "0.0.0.0"
      - "--port"
      - "8080"
      - "--model"
      - "/models/llama-3.gguf"

volumes:
  quetza-logs:
```

### Environment Variables File

Create a `.env` file in the same directory:

```env
# Required
DISCORD_TOKEN=your_discord_bot_token_here

# Optional - AI Module
LLAMA_API_URL=http://llama-api:8080/v1
LLAMA_MODEL=llama-3
```

**Security Note**: Never commit `.env` files to version control. Add it to `.gitignore`.

### Running with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f quetza

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# View running services
docker-compose ps
```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  quetza:
    image: deytenit/quetza:latest
    container_name: quetza
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - LLAMA_API_URL=${LLAMA_API_URL:-}
      - LLAMA_MODEL=${LLAMA_MODEL:-}
      - NODE_ENV=production
    volumes:
      - quetza-logs:/usr/src/app/log
    networks:
      - quetza-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "node", "-e", "process.exit(0)"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  quetza-logs:

networks:
  quetza-network:
    driver: bridge
```

---

## Volume Management

Volumes are used to persist data outside the container lifecycle, primarily for log files.

### Log Directory

Quetza writes logs to `/usr/src/app/log` inside the container.

#### Named Volume (Recommended)

```bash
# Create named volume
docker volume create quetza-logs

# Run with named volume
docker run \
  -v quetza-logs:/usr/src/app/log \
  deytenit/quetza:latest
```

**Advantages**:
- Managed by Docker
- Platform-independent
- Easier to backup and migrate

#### Bind Mount

```bash
# Run with bind mount
docker run \
  -v /path/on/host/logs:/usr/src/app/log \
  deytenit/quetza:latest
```

**Use cases**:
- Direct access to logs from host
- Integration with log aggregation tools
- Development and debugging

### Volume Operations

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect quetza-logs

# Find volume location on host
docker volume inspect quetza-logs --format '{{ .Mountpoint }}'

# Backup volume
docker run --rm \
  -v quetza-logs:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/quetza-logs-backup.tar.gz /data

# Restore volume
docker run --rm \
  -v quetza-logs:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/quetza-logs-backup.tar.gz -C /

# Remove volume (when container is stopped)
docker volume rm quetza-logs
```

### Log Rotation

When using volumes, implement log rotation to prevent unbounded growth:

**Using Docker logging options** (recommended):

```yaml
services:
  quetza:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Using logrotate on host** (for bind mounts):

Create `/etc/logrotate.d/quetza`:

```
/path/to/host/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0640 node node
}
```

---

## Container Networking

Quetza connects to Discord's API over the internet and may need to communicate with other services (like Llama API).

### Default Bridge Network

By default, containers use Docker's bridge network and can access external services.

```bash
# Run on default bridge
docker run -d deytenit/quetza:latest
```

### Custom Bridge Network

Create an isolated network for your services:

```bash
# Create network
docker network create quetza-network

# Run container on network
docker run \
  --network quetza-network \
  --name quetza \
  -d \
  deytenit/quetza:latest
```

### Docker Compose Networking

```yaml
version: '3.8'

services:
  quetza:
    networks:
      - quetza-network

  llama-api:
    networks:
      - quetza-network

networks:
  quetza-network:
    driver: bridge
```

**Service Discovery**: Services can communicate using service names as hostnames (e.g., `http://llama-api:8080`).

### Port Exposure

Quetza does **not** expose any ports by default as it only makes outbound connections to Discord's API. Port exposure is only needed for auxiliary services:

```yaml
services:
  llama-api:
    ports:
      - "8080:8080"  # Expose Llama API (if needed for external access)
```

### Network Troubleshooting

```bash
# Inspect network
docker network inspect quetza-network

# Test connectivity from container
docker exec quetza ping -c 3 llama-api

# View container network settings
docker inspect quetza --format '{{ .NetworkSettings }}'
```

---

## Multi-platform Support

Quetza images are built for both AMD64 and ARM64 architectures using Docker Buildx.

### Supported Platforms

| Platform | Architecture | Support Level | Use Cases |
|----------|--------------|---------------|-----------|
| `linux/amd64` | x86_64 | ✅ Full | Servers, workstations, cloud VMs |
| `linux/arm64` | ARM 64-bit | ✅ Full | Raspberry Pi 3+, AWS Graviton, Apple Silicon |

### Platform Selection

Docker automatically pulls the correct image for your platform:

```bash
# Docker selects platform automatically
docker pull deytenit/quetza:latest

# Explicitly specify platform
docker pull --platform linux/amd64 deytenit/quetza:latest
docker pull --platform linux/arm64 deytenit/quetza:latest
```

### Running on Different Platforms

**On Raspberry Pi 4 (ARM64)**:

```bash
# Docker automatically uses ARM64 image
docker run \
  -e DISCORD_TOKEN=your_token \
  --name quetza \
  -d \
  deytenit/quetza:latest
```

**On Apple Silicon (M1/M2/M3)**:

```bash
# Docker Desktop uses ARM64 image natively
docker run \
  -e DISCORD_TOKEN=your_token \
  --name quetza \
  -d \
  deytenit/quetza:latest
```

**Cross-platform Emulation** (x86 on ARM or vice versa):

```bash
# Run AMD64 image on ARM64 host (slower)
docker run --platform linux/amd64 \
  -e DISCORD_TOKEN=your_token \
  deytenit/quetza:latest
```

⚠️ **Note**: Cross-platform emulation uses QEMU and is significantly slower. Use native images when possible.

### Building Multi-platform Images

If building from source (see [Source Installation](./02-source-installation.md)), create multi-platform images:

```bash
# Setup buildx
docker buildx create --name quetza-builder --use
docker buildx inspect --bootstrap

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myrepo/quetza:custom \
  --push \
  .
```

### Platform-Specific Considerations

**ARM64 Performance**:
- Native ARM64 performance is excellent on modern ARM processors
- FFmpeg and yt-dlp are compiled for ARM64 in the image
- Music playback works identically on ARM64 and AMD64

**Resource Requirements**:
- ARM64 (Raspberry Pi 4): Minimum 2GB RAM recommended
- AMD64: Minimum 1GB RAM recommended
- CPU: At least 2 cores for smooth music playback

---

## Next Steps

- **[Source Installation](./02-source-installation.md)** - Build Quetza from source
- **[Environment Configuration](./03-environment-configuration.md)** - Detailed environment variable reference
- **[External Dependencies](./04-external-dependencies.md)** - Understanding yt-dlp and FFmpeg setup

---

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs quetza

# Common issues:
# - Missing DISCORD_TOKEN: Add -e DISCORD_TOKEN=...
# - Invalid token: Verify token at Discord Developer Portal
```

### Image Pull Fails

```bash
# Verify image exists
docker pull deytenit/quetza:latest

# Check Docker Hub status
# Try different tag (latest-dev, specific version)
```

### Logs Not Persisting

```bash
# Verify volume is mounted
docker inspect quetza --format '{{ .Mounts }}'

# Check volume exists
docker volume ls | grep quetza
```

### Platform Issues

```bash
# Check platform of pulled image
docker image inspect deytenit/quetza:latest --format '{{ .Architecture }}'

# Should match your system architecture
uname -m  # x86_64 = amd64, aarch64 = arm64
```

---

[← Back to Section 2](./README.md) | [Next: Source Installation →](./02-source-installation.md)

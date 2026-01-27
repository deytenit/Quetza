# 2.4 External Dependencies Setup

Quetza's Music module requires external binaries for audio processing and downloading. This guide covers installation, configuration, and verification of these dependencies.

## Table of Contents

- [yt-dlp Installation](#yt-dlp-installation)
- [FFmpeg Configuration](#ffmpeg-configuration)
- [Binary Path Configuration](#binary-path-configuration)
- [Dependency Verification](#dependency-verification)

---

## External Dependencies Overview

### Required Dependencies

| Dependency | Purpose | Required For | Version |
|------------|---------|--------------|---------|
| **yt-dlp** | Download audio from YouTube, SoundCloud, etc. | Music Module | Latest |
| **FFmpeg** | Audio processing, transcoding, filtering | Music Module | 4.0+ |
| **Python 3** | Runtime for yt-dlp | Music Module | 3.7+ |

### Dependency Matrix

| Deployment Method | yt-dlp | FFmpeg | Python | Notes |
|-------------------|--------|--------|--------|-------|
| **Docker** | ✅ Included | ✅ Included | ✅ Included | All dependencies pre-installed |
| **Source** | ❌ Manual | ❌ Manual | ⚠️ System | Must install separately |

---

## yt-dlp Installation

[yt-dlp](https://github.com/yt-dlp/yt-dlp) is a youtube-dl fork with additional features and fixes. It downloads audio streams from various platforms.

### Installation Methods

#### Method 1: Binary Download (Recommended)

**Linux/macOS**:
```bash
# Create bin directory
mkdir -p ./bin

# Download latest release
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp

# Make executable
chmod +x ./bin/yt-dlp

# Verify installation
./bin/yt-dlp --version
```

**Windows**:
```powershell
# Create bin directory
New-Item -ItemType Directory -Force -Path .\bin

# Download latest release
Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile ".\bin\yt-dlp.exe"

# Verify installation
.\bin\yt-dlp.exe --version
```

#### Method 2: Using pip (Python Package)

```bash
# Install globally
pip install yt-dlp

# Or with user flag (no sudo)
pip install --user yt-dlp

# Verify installation
yt-dlp --version

# Check installation path
which yt-dlp  # Linux/macOS
where yt-dlp  # Windows
```

#### Method 3: Package Managers

**Linux (Debian/Ubuntu)**:
```bash
# Add repository (for latest version)
sudo add-apt-repository ppa:tomtomtom/yt-dlp
sudo apt update

# Install
sudo apt install yt-dlp

# Verify
yt-dlp --version
```

**Linux (Arch)**:
```bash
# Install from community repository
sudo pacman -S yt-dlp

# Verify
yt-dlp --version
```

**macOS (Homebrew)**:
```bash
# Install
brew install yt-dlp

# Verify
yt-dlp --version
```

**Windows (Chocolatey)**:
```powershell
# Install
choco install yt-dlp

# Verify
yt-dlp --version
```

**Windows (Scoop)**:
```powershell
# Install
scoop install yt-dlp

# Verify
yt-dlp --version
```

### Docker Installation

In Docker deployments, yt-dlp is automatically installed during the build process:

```dockerfile
# From Dockerfile (builder stage)
RUN mkdir ./dist/bin/
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/src/app/dist/bin/yt-dlp
RUN chmod a+rx /usr/src/app/dist/bin/yt-dlp
```

**What this does**:
1. Creates `/usr/src/app/dist/bin/` directory
2. Downloads latest yt-dlp binary
3. Makes it executable for all users
4. Includes it in the final image at `/usr/src/app/bin/yt-dlp`

### Updating yt-dlp

**Standalone binary**:
```bash
# Re-download to update
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
chmod +x ./bin/yt-dlp
```

**Pip installation**:
```bash
pip install --upgrade yt-dlp
```

**Package manager**:
```bash
# Debian/Ubuntu
sudo apt update && sudo apt upgrade yt-dlp

# macOS
brew upgrade yt-dlp

# Windows
choco upgrade yt-dlp
# or
scoop update yt-dlp
```

**Docker**: Rebuild image or pull latest pre-built image

### Supported Platforms

yt-dlp supports extracting from **1000+** websites. Quetza primarily uses:

| Platform | Support | Notes |
|----------|---------|-------|
| YouTube | ✅ Full | Primary platform |
| SoundCloud | ✅ Full | Music streaming |
| Bandcamp | ✅ Full | Independent artists |
| Spotify | ⚠️ Limited | May require premium/cookies |
| Twitch | ✅ Full | Live streams and VODs |
| Vimeo | ✅ Full | Video platform |

**See full list**: `yt-dlp --list-extractors`

### Usage in Quetza

Quetza's Music module uses yt-dlp to:
1. Extract metadata (title, artist, duration, thumbnail)
2. Get direct audio stream URLs
3. Support multiple platforms transparently

**Example command flow**:
```
User: /play query: Rick Astley Never Gonna Give You Up

1. Quetza searches using yt-dlp
2. yt-dlp finds YouTube video
3. yt-dlp extracts audio stream URL
4. Quetza streams audio through Discord voice
```

---

## FFmpeg Configuration

[FFmpeg](https://ffmpeg.org/) is a complete cross-platform solution for recording, converting, and streaming audio and video.

### Installation Methods

#### Linux (Debian/Ubuntu)

```bash
# Update package list
sudo apt update

# Install FFmpeg
sudo apt install ffmpeg

# Verify installation
ffmpeg -version

# Check version (should be 4.0+)
ffmpeg -version | grep version
```

#### Linux (Arch)

```bash
# Install
sudo pacman -S ffmpeg

# Verify
ffmpeg -version
```

#### Linux (Fedora/RHEL/CentOS)

```bash
# Enable RPM Fusion repository (if not already enabled)
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm

# Install FFmpeg
sudo dnf install ffmpeg

# Verify
ffmpeg -version
```

#### macOS (Homebrew)

```bash
# Install
brew install ffmpeg

# Verify
ffmpeg -version

# Optional: Install with additional codecs
brew install ffmpeg --with-fdk-aac --with-libopus
```

#### Windows

**Option 1: Chocolatey**
```powershell
# Install
choco install ffmpeg

# Verify
ffmpeg -version
```

**Option 2: Manual Installation**

1. Download from [FFmpeg official site](https://ffmpeg.org/download.html) or [gyan.dev builds](https://www.gyan.dev/ffmpeg/builds/)
2. Extract archive (e.g., `ffmpeg-release-full.7z`)
3. Add `bin/` directory to PATH:
   ```powershell
   # Add to user PATH
   $env:Path += ";C:\ffmpeg\bin"
   
   # Permanently add (requires admin)
   setx PATH "$env:Path;C:\ffmpeg\bin" /M
   ```
4. Verify:
   ```powershell
   ffmpeg -version
   ```

**Option 3: Scoop**
```powershell
scoop install ffmpeg
ffmpeg -version
```

### Docker Installation

In Docker, FFmpeg is installed in the runtime stage:

```dockerfile
# From Dockerfile (runtime stage)
FROM node:20-alpine

RUN apk update
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache python3
```

**What this does**:
1. Updates Alpine package index
2. Installs FFmpeg from Alpine repositories
3. Installs Python 3 (for yt-dlp)
4. Keeps image size minimal (`--no-cache`)

### FFmpeg Features Used by Quetza

**Audio Processing**:
- **Transcoding**: Convert various formats to Opus (Discord's codec)
- **Filtering**: Apply audio effects (bass boost, nightcore, etc.)
- **Volume Control**: Adjust playback volume
- **Seeking**: Jump to specific timestamps

**Example FFmpeg commands** (internal to Quetza):

```bash
# Stream with volume filter
ffmpeg -i input.mp4 -f opus -af "volume=0.5" pipe:1

# Apply bass boost filter
ffmpeg -i input.mp4 -f opus -af "bass=g=10" pipe:1

# Multiple filters
ffmpeg -i input.mp4 -f opus -af "bass=g=5,atempo=1.2,volume=0.8" pipe:1
```

### Required FFmpeg Codecs

Quetza requires these FFmpeg capabilities:

| Codec/Format | Purpose | Required |
|--------------|---------|----------|
| **Opus** | Discord voice codec | ✅ Yes |
| **libmp3lame** | MP3 decoding | ✅ Yes |
| **AAC** | AAC decoding | ✅ Yes |
| **Vorbis** | OGG/WebM decoding | ✅ Yes |
| **libopus** | Opus encoding | ✅ Yes |

**Verify codecs**:
```bash
# Check available encoders
ffmpeg -encoders | grep opus

# Check available decoders
ffmpeg -decoders | grep -E "mp3|aac|vorbis"

# Check filters
ffmpeg -filters | grep -E "volume|bass|atempo"
```

Most modern FFmpeg builds include all required codecs by default.

---

## Binary Path Configuration

Quetza needs to locate yt-dlp and FFmpeg binaries at runtime.

### Default Binary Locations

**From config.ts**:
```typescript
/** External binaries directory. */
const binariesDir = join(rootDir, "/bin/");

const path = {
    root: rootDir,
    binaries: binariesDir
};
```

### Binary Search Order

Quetza searches for binaries in this order:

1. **Custom binaries directory**: `/usr/src/app/bin/` (Docker) or `./bin/` (source)
2. **System PATH**: Uses system-installed binaries as fallback

### Source Installation Binary Setup

**Recommended Structure**:
```
Quetza/
├── bin/
│   └── yt-dlp          # Custom yt-dlp binary
├── src/
├── modules/
├── package.json
└── ...
```

**Setup**:
```bash
# Create bin directory
mkdir -p bin

# Download yt-dlp to bin/
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
chmod +x ./bin/yt-dlp

# FFmpeg should be in system PATH
which ffmpeg  # Should return path, e.g., /usr/bin/ffmpeg
```

### Docker Binary Setup

In Docker, binaries are located at:

```
/usr/src/app/
├── bin/
│   └── yt-dlp          # Included in build
├── src/
│   └── index.js
└── ...

# FFmpeg location
/usr/bin/ffmpeg         # System install
```

**No additional setup needed** - everything is pre-configured.

### PATH Environment Variable

If binaries are not in default locations, ensure they're in PATH:

**Linux/macOS**:
```bash
# Add to PATH (temporary)
export PATH="$PATH:/path/to/Quetza/bin"

# Add to shell profile (permanent)
echo 'export PATH="$PATH:/path/to/Quetza/bin"' >> ~/.bashrc
source ~/.bashrc
```

**Windows**:
```powershell
# Add to PATH (temporary)
$env:Path += ";C:\path\to\Quetza\bin"

# Add to PATH (permanent - requires admin)
setx PATH "$env:Path;C:\path\to\Quetza\bin" /M
```

### Custom Binary Paths (Advanced)

If you need to use binaries from non-standard locations, you can modify the Music module's fetcher to accept custom paths:

```typescript
// modules/music/lib/fetch.ts (example modification)
const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

// Then set environment variables
export YTDLP_PATH=/custom/path/to/yt-dlp
export FFMPEG_PATH=/custom/path/to/ffmpeg
```

**Note**: This requires code modification as Quetza doesn't currently support custom binary path environment variables.

---

## Dependency Verification

After installation, verify all dependencies are correctly configured.

### Verification Checklist

```bash
# 1. Check yt-dlp
yt-dlp --version
# Expected: yt-dlp version (e.g., 2024.01.01)

# 2. Check FFmpeg
ffmpeg -version
# Expected: ffmpeg version 4.x.x or higher

# 3. Check Python (for yt-dlp)
python3 --version
# Expected: Python 3.7.0 or higher

# 4. Test yt-dlp functionality
yt-dlp --print "%(title)s" "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
# Expected: Video title

# 5. Test FFmpeg functionality
ffmpeg -f lavfi -i sine=frequency=1000:duration=1 -f null -
# Expected: Generates sine wave (no actual output)
```

### Automated Verification Script

Create a verification script `verify-deps.sh`:

```bash
#!/bin/bash

echo "=== Quetza Dependency Verification ==="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check yt-dlp
echo -n "Checking yt-dlp... "
if command -v yt-dlp &> /dev/null; then
    VERSION=$(yt-dlp --version)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo -e "${YELLOW}Install:${NC} curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp && chmod +x ./bin/yt-dlp"
fi

# Check FFmpeg
echo -n "Checking FFmpeg... "
if command -v ffmpeg &> /dev/null; then
    VERSION=$(ffmpeg -version | head -n1 | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
    
    # Check for required codecs
    echo -n "  - Checking Opus codec... "
    if ffmpeg -encoders 2>/dev/null | grep -q "libopus"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC} Missing"
    fi
else
    echo -e "${RED}✗${NC} Not found"
    echo -e "${YELLOW}Install:${NC} sudo apt install ffmpeg (Linux) or brew install ffmpeg (macOS)"
fi

# Check Python
echo -n "Checking Python 3... "
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo -e "${YELLOW}Note:${NC} Python is required for yt-dlp to run"
fi

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
fi

# Check pnpm
echo -n "Checking pnpm... "
if command -v pnpm &> /dev/null; then
    VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo -e "${YELLOW}Install:${NC} npm install -g pnpm"
fi

echo ""
echo "=== Verification Complete ==="
```

**Run verification**:
```bash
chmod +x verify-deps.sh
./verify-deps.sh
```

### Docker Verification

For Docker deployments, verify inside the container:

```bash
# Run verification in container
docker exec quetza sh -c "yt-dlp --version && ffmpeg -version && python3 --version"

# Interactive shell for manual testing
docker exec -it quetza sh

# Inside container
yt-dlp --version
ffmpeg -version
ls -la /usr/src/app/bin/
```

### Testing Music Module

The ultimate verification is testing the Music module:

**In Discord**:
```
1. Join a voice channel
2. Run: /connect
3. Run: /play query: test song
4. Bot should connect and play audio
```

**Expected behavior**:
- Bot joins voice channel
- Song queued and starts playing
- Audio is clear without distortion

**If music doesn't play**, check:
```bash
# Check logs
docker logs quetza
# or
pnpm start  # Check console output

# Look for errors like:
# - "yt-dlp: command not found"
# - "ffmpeg: command not found"  
# - "Failed to extract info"
```

### Common Issues and Solutions

**Issue**: `yt-dlp: command not found`
```bash
# Solution: Install yt-dlp or add to PATH
export PATH="$PATH:$(pwd)/bin"
```

**Issue**: `ffmpeg: command not found`
```bash
# Solution: Install FFmpeg
# Debian/Ubuntu: sudo apt install ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
```

**Issue**: `Python not found` (when running yt-dlp)
```bash
# Solution: Install Python 3
# Debian/Ubuntu: sudo apt install python3
# macOS: brew install python3
# Windows: Download from python.org
```

**Issue**: `Permission denied` when running yt-dlp
```bash
# Solution: Make binary executable
chmod +x ./bin/yt-dlp
```

**Issue**: yt-dlp fails with `ERROR: unable to download video data`
```bash
# Solution: Update yt-dlp
pip install --upgrade yt-dlp
# or
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
```

**Issue**: FFmpeg missing required codec
```bash
# Solution: Reinstall FFmpeg with full codec support
# Linux: Use official repositories or compile from source
# macOS: brew reinstall ffmpeg
# Windows: Download full build from gyan.dev
```

---

## Minimum Versions

| Dependency | Minimum Version | Recommended | Notes |
|------------|----------------|-------------|-------|
| yt-dlp | 2023.01.01 | Latest | Frequent updates for site changes |
| FFmpeg | 4.0 | 5.0+ | Older versions may lack features |
| Python | 3.7 | 3.10+ | Required for yt-dlp |
| Node.js | 20.x | 22.x | Quetza requirement |

---

## Next Steps

- **[Docker Deployment](./01-docker-deployment.md)** - Deploy with pre-configured dependencies
- **[Source Installation](./02-source-installation.md)** - Complete source setup guide
- **[Music Module Documentation](../04-modules/02-music-module.md)** - Learn how Music module uses these tools

---

## Platform-Specific Notes

### Raspberry Pi (ARM64)

```bash
# Install dependencies
sudo apt update
sudo apt install ffmpeg python3

# Download ARM-compatible yt-dlp
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
chmod +x ./bin/yt-dlp

# Verify
./bin/yt-dlp --version
ffmpeg -version
```

### Windows Subsystem for Linux (WSL)

```bash
# Same as Linux installation
sudo apt update
sudo apt install ffmpeg python3 curl

# Download yt-dlp
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
chmod +x ./bin/yt-dlp
```

### macOS (Apple Silicon M1/M2/M3)

```bash
# Homebrew automatically installs ARM64 versions
brew install ffmpeg yt-dlp

# Verify architecture
file $(which ffmpeg)
# Should show: Mach-O 64-bit executable arm64

file $(which yt-dlp)
# Python script (architecture independent)
```

---

[← Back to Section 2](./README.md) | [Next: Core Architecture →](../03-core-architecture/)

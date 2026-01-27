# Introduction

Welcome to Quetza, a powerful and modular Discord bot built with TypeScript!

## What is Quetza?

Quetza is an extensible Discord bot that brings rich functionality to your Discord server. Built with a clean modular architecture, Quetza is designed to be both easy to use and straightforward to extend with custom features. The name "Quetza" is inspired by the Quetzal bird, known for its vibrant colors and freedom, reflecting the bot's colorful responses and flexible design.

At its core, Quetza is a lightweight Discord client enhanced with a powerful module system. Each module defines specific features and capabilities, making it easy to understand what the bot does and how to customize it for your needs. The bot currently ships with three main modules:

- **Core Module**: Provides fundamental bot operations and utilities
- **Music Module**: Advanced music playback with queue management and audio filters
- **AI Module**: Conversational AI powered by Llama LLM integration

## Key Features

### 🎵 Advanced Music Playback
- **Multi-platform Support**: Play music from YouTube, SoundCloud, and other platforms via yt-dlp
- **Queue Management**: Add, remove, reorder, and jump between tracks with ease
- **Loop Modes**: Loop single tracks, entire queues, or enable auto-play mode
- **Audio Filters**: Apply real-time audio effects like bass boost, nightcore, 8D, and more
- **Playback Controls**: Pause, resume, seek within tracks, and control volume
- **Smart Shuffle**: Reshuffle your queue while maintaining playback

### 🤖 AI Conversations
- **Natural Language Processing**: Chat with an AI powered by locally-deployed Llama models
- **Context-Aware**: Maintains conversation history for coherent multi-turn discussions
- **Per-User Conversations**: Separate conversation contexts for each user in each guild
- **Privacy-Focused**: Use your own Llama deployment for complete data control

### 🏗️ Modular Architecture
- **Clean Separation**: Each feature is isolated in its own module
- **Easy Extension**: Add new commands, events, and features by creating new modules
- **Controller Pattern**: Modules can include sophisticated controllers for complex state management
- **TypeScript-First**: Fully typed codebase for better developer experience and reliability

### 🎨 Rich Interactions
- **Slash Commands**: Modern Discord slash command integration
- **Colorful Embeds**: Visually appealing responses with contextual colors
- **Interactive Feedback**: Real-time status updates and playback information
- **Error Handling**: Graceful error messages that guide users

### 🐳 Easy Deployment
- **Docker Support**: Pre-built Docker images for hassle-free deployment
- **Source Installation**: Full control with manual installation from source
- **Minimal Configuration**: Only requires a Discord token to get started
- **Multi-platform**: Runs on Linux, macOS, and Windows

## Project Philosophy

Quetza is built on several core principles:

### Modularity First
Every feature lives in its own module, following a consistent structure. This makes the codebase easy to navigate, understand, and extend. Whether you're fixing a bug, adding a feature, or creating an entirely new module, you always know where to look and what patterns to follow.

### Developer Experience
The project embraces TypeScript for type safety and better tooling. Clear interfaces define how modules, commands, and events should be structured. The build system handles compilation and path resolution automatically, letting you focus on building features.

### Simplicity and Clarity
Quetza avoids unnecessary abstractions. The code does what it says, and the architecture is straightforward. Comments explain the "why," not the "what," and the module system makes feature boundaries explicit.

### Extensibility
While Quetza ships with specific features, it's designed to be a foundation for your own ideas. The module system makes it easy to add custom functionality without modifying the core bot logic. You can enable or disable modules as needed, and modules can't interfere with each other.

### Production Ready
From comprehensive logging with Winston to Docker deployment with CI/CD integration, Quetza is built to run reliably in production. The codebase includes linting, formatting, and build verification to maintain quality.

## Use Cases

### Personal Discord Server
Run Quetza on your personal server to:
- Play music during gaming sessions or hangouts
- Get AI assistance for questions and brainstorming
- Monitor bot activity and experiment with custom modules
- Learn Discord bot development with a well-structured codebase

### Community Server
Deploy Quetza for your community to:
- Provide entertainment with rich music features
- Offer interactive AI conversation for members
- Build custom modules for community-specific needs
- Maintain separate conversation contexts per user

### Development Learning
Use Quetza to:
- Learn Discord.js and Discord bot development
- Study TypeScript project architecture
- Understand modular software design
- Practice Docker deployment and CI/CD
- Explore audio streaming and AI integration

### Custom Bot Foundation
Fork Quetza to:
- Build specialized bots with custom modules
- Leverage the solid foundation and module system
- Avoid reinventing core Discord bot infrastructure
- Focus on your unique features and functionality

## What's Next?

Ready to get started with Quetza? Continue to the [Quick Start Guide](./02-quick-start-guide.md) to install and configure the bot, or check the [System Requirements](./03-system-requirements.md) to ensure your environment is ready.

For developers interested in creating custom modules or contributing to Quetza, see the [Development Guide](../05-development-guide/) for detailed information on the architecture and development workflow.

---

**Note**: Quetza is open source under the MIT License. The code is free to use, modify, and distribute. However, the Quetza branding and assets (like the logo) are protected under a separate license. See the [LICENSE](../../LICENCE) file for details.

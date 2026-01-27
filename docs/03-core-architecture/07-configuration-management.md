# 3.7 Configuration Management

Quetza's configuration system centralizes all application settings in a single TypeScript file, providing type safety and easy access throughout the application.

## 3.7.1 Configuration Structure

The entire configuration is defined in `config.ts` at the project root:

```typescript
// config.ts
import { ActivityOptions, ActivityType, ColorResolvable } from "discord.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/** Quetza project root directory. */
const rootDir = dirname(fileURLToPath(import.meta.url));
/** Quetza's modules directory. */
const modulesDir = join(rootDir, "/modules/");
/** External binaries directory. */
const binariesDir = join(rootDir, "/bin/");
/** Logger files directory. */
const loggerDir = join(rootDir, "/log/");

/** Locations that might be useful in application. */
const path = {
    root: rootDir,
    modules: modulesDir,
    binaries: binariesDir,
    log: loggerDir
};

/** Discord bot token. */
const appToken = process.env.DISCORD_TOKEN;
/** Discord bot user activity status */
const appActivity = { type: ActivityType.Watching, name: "over you" };

/** Bot application configuration variables. */
const application = {
    token: appToken,
    activity: appActivity as ActivityOptions
};

/** Colors Quetza uses in responses. */
const colors = {
    default: "#ff6e9b" as ColorResolvable,
    error: "#b94e59" as ColorResolvable,
    warning: "#e5925f" as ColorResolvable,
    info: "#367df6" as ColorResolvable,
    success: "#83d18e" as ColorResolvable
};

/** Guild where testing occures. */
const testGuild = "912401672939139142";

/** Developing options. */
const dev = {
    guild: testGuild
};

/** AI module secrets. */
const llama = {
    apiUrl: process.env.LLAMA_API_URL,
    model: process.env.LLAMA_MODEL
};

/** Exported bundled configuration object. */
const config = {
    application,
    colors,
    path,
    dev,
    llama
};

export default config;
```

### Configuration Export

The config object is exported as the default export:

```typescript
export default config;
```

This allows simple imports throughout the application:

```typescript
import config from "$config.js";

// Access configuration
const token = config.application.token;
const errorColor = config.colors.error;
```

## 3.7.2 Path Configuration

Path configuration provides centralized path management using ES modules:

### Root Directory Resolution

```typescript
const rootDir = dirname(fileURLToPath(import.meta.url));
```

**How it works:**
1. `import.meta.url`: Current module's URL (file:///path/to/config.ts)
2. `fileURLToPath()`: Convert URL to file system path (/path/to/config.ts)
3. `dirname()`: Get directory containing the file (/path/to)

**Result:** Absolute path to project root

### Path Definitions

```typescript
const path = {
    root: rootDir,                    // /path/to/quetza
    modules: modulesDir,              // /path/to/quetza/modules
    binaries: binariesDir,            // /path/to/quetza/bin
    log: loggerDir                    // /path/to/quetza/log
};
```

### Path Construction

Paths are built using `path.join()`:

```typescript
const modulesDir = join(rootDir, "/modules/");
const binariesDir = join(rootDir, "/bin/");
const loggerDir = join(rootDir, "/log/");
```

**Benefits:**
- Platform-independent (works on Windows, Linux, macOS)
- Handles path separators correctly
- Resolves relative paths
- Avoids double slashes

### Usage in Code

```typescript
// Client module loading
readdirSync(config.path.modules).forEach((module) => {
    // Import modules from config.path.modules
});

// Logger file paths
const errorLog = path.join(config.path.log, "error.log");
const combinedLog = path.join(config.path.log, "combined.log");

// Binary execution (music module)
const ytdlpPath = path.join(config.path.binaries, "yt-dlp");
```

### Path Aliases

TypeScript path aliases are configured separately in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$config.js": ["./config.ts"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

These are resolved at build time by `tsc-alias`.

## 3.7.3 Application Configuration

Application configuration contains Discord bot settings:

```typescript
const application = {
    token: appToken,
    activity: appActivity as ActivityOptions
};
```

### Discord Token

```typescript
const appToken = process.env.DISCORD_TOKEN;
```

**Source:** Environment variable `DISCORD_TOKEN`

**Usage:**
```typescript
// src/index.ts
client.login(config.application.token);
```

**Security:**
- Never hardcode tokens in source code
- Use environment variables or secrets management
- Exclude `.env` from version control

### Bot Activity

```typescript
const appActivity = { 
    type: ActivityType.Watching, 
    name: "over you" 
};
```

**Type:** Discord.js `ActivityOptions`

**Activity Types:**
- `ActivityType.Playing` - "Playing {name}"
- `ActivityType.Streaming` - "Streaming {name}"
- `ActivityType.Listening` - "Listening to {name}"
- `ActivityType.Watching` - "Watching {name}"
- `ActivityType.Competing` - "Competing in {name}"

**Usage:**
```typescript
// Set on ready event
client.user.setActivity(config.application.activity);
```

**Result:** Bot's status shows "Watching over you"

### Custom Activity Examples

```typescript
// Playing a game
const appActivity = { 
    type: ActivityType.Playing, 
    name: "music for everyone" 
};

// Listening to music
const appActivity = { 
    type: ActivityType.Listening, 
    name: "your requests" 
};

// With URL (streaming)
const appActivity = { 
    type: ActivityType.Streaming, 
    name: "live music",
    url: "https://twitch.tv/example"
};
```

## 3.7.4 Color Schemes

Quetza uses consistent colors for embed messages:

```typescript
const colors = {
    default: "#ff6e9b" as ColorResolvable,
    error: "#b94e59" as ColorResolvable,
    warning: "#e5925f" as ColorResolvable,
    info: "#367df6" as ColorResolvable,
    success: "#83d18e" as ColorResolvable
};
```

### Color Values

| Color | Hex | RGB | Purpose |
|-------|-----|-----|---------|
| default | `#ff6e9b` | (255, 110, 155) | General messages, branding |
| error | `#b94e59` | (185, 78, 89) | Error messages, failures |
| warning | `#e5925f` | (229, 146, 95) | Warnings, deprecations |
| info | `#367df6` | (54, 125, 246) | Informational messages |
| success | `#83d18e` | (131, 209, 142) | Success confirmations |

### Color Type

```typescript
type ColorResolvable = string | number | [number, number, number]
```

Colors are cast to `ColorResolvable` for Discord.js compatibility.

### Usage in Embeds

```typescript
import { EmbedBuilder } from "discord.js";
import config from "$config.js";

// Error message
const errorEmbed = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Something went wrong")
    .setColor(config.colors.error);

// Success message
const successEmbed = new EmbedBuilder()
    .setTitle("Success")
    .setDescription("Track added to queue")
    .setColor(config.colors.success);

// Info message
const infoEmbed = new EmbedBuilder()
    .setTitle("Now Playing")
    .setDescription(track.title)
    .setColor(config.colors.info);
```

### Color Consistency

Using centralized colors ensures:
- **Visual consistency** across all bot responses
- **Easy theme changes** (modify once, apply everywhere)
- **Type safety** (compile-time checking)
- **Brand identity** (consistent color palette)

## 3.7.5 Development Settings

Development configuration provides settings for testing and debugging:

```typescript
const testGuild = "912401672939139142";

const dev = {
    guild: testGuild
};
```

### Test Guild

**Purpose:** Development servers receive instant command updates

**Why needed:**
- Global commands take up to 1 hour to propagate
- Guild commands update instantly
- Speeds up development iteration

**Usage:**
```typescript
// modules/core/events/ready.ts
if (process.env.NODE_ENV === "development") {
    const guild = await client.guilds.fetch(config.dev.guild);
    guild.commands.set(commandData);  // Instant updates
}
```

### Environment Modes

Quetza distinguishes between development and production:

```bash
# Development mode
NODE_ENV=development npm start

# Production mode
NODE_ENV=production npm start
```

**Behavior differences:**

| Aspect | Development | Production |
|--------|-------------|------------|
| Command registration | Test guild only | Global (all servers) |
| Command update speed | Instant | Up to 1 hour |
| Logging verbosity | More detailed | Standard |
| Dependency report | Shown | Hidden |

### Setting Up Test Guild

1. Create a Discord server for testing
2. Add your bot to the server
3. Copy the server ID (Enable Developer Mode → Right-click server → Copy ID)
4. Update `config.ts`:

```typescript
const testGuild = "YOUR_GUILD_ID_HERE";
```

## Module-Specific Configuration

Some modules require additional configuration:

### AI Module Configuration

```typescript
const llama = {
    apiUrl: process.env.LLAMA_API_URL,
    model: process.env.LLAMA_MODEL
};
```

**Environment variables:**
- `LLAMA_API_URL`: URL to Llama API endpoint (e.g., `http://localhost:8080`)
- `LLAMA_MODEL`: Model identifier to use (e.g., `llama-2-7b`)

**Usage:**
```typescript
// modules/ai/lib/llama.ts
import config from "$config.js";

const llamaClient = new LlamaClient(
    config.llama.apiUrl,
    config.llama.model
);
```

**Optional:** If environment variables aren't set, the AI module won't function.

## Environment Variables

Configuration relies on environment variables for sensitive or deployment-specific values:

### Required Variables

```bash
DISCORD_TOKEN=your_bot_token_here
```

### Optional Variables

```bash
# AI Module
LLAMA_API_URL=http://localhost:8080
LLAMA_MODEL=llama-2-7b

# Environment
NODE_ENV=development  # or production
```

### .env File

For local development, create a `.env` file:

```bash
# .env (DO NOT COMMIT TO GIT)
DISCORD_TOKEN=YOUR_TOKEN_HERE
NODE_ENV=development

# AI Module (optional)
LLAMA_API_URL=http://localhost:8080
LLAMA_MODEL=llama-2-7b
```

Load with a package like `dotenv`:

```typescript
// At app entry point
import dotenv from "dotenv";
dotenv.config();
```

**Security:**
- Add `.env` to `.gitignore`
- Never commit tokens to version control
- Use secrets management in production

## Configuration Best Practices

1. **Centralize configuration**: Keep all config in one place
2. **Use environment variables**: For secrets and deployment-specific values
3. **Type safety**: Leverage TypeScript for config structure
4. **Document settings**: Comment each configuration option
5. **Provide defaults**: Where sensible (not for secrets)
6. **Validate early**: Check required config at startup
7. **Immutable exports**: Export as `const` to prevent modification
8. **Path abstraction**: Use config.path instead of hardcoded paths

## Configuration Access Patterns

### Import Once, Use Everywhere

```typescript
import config from "$config.js";

// Access nested properties
const token = config.application.token;
const modulesPath = config.path.modules;
const errorColor = config.colors.error;
const testGuildId = config.dev.guild;
```

### Destructuring

```typescript
import config from "$config.js";

const { colors, path } = config;

// Use destructured values
const embed = new EmbedBuilder().setColor(colors.success);
const modulePath = path.modules;
```

### Type Safety

TypeScript infers types from the config object:

```typescript
// config.application.token is string | undefined
// config.colors.error is ColorResolvable
// config.path.modules is string
```

## Configuration Validation

While not currently implemented, production applications should validate configuration at startup:

```typescript
// Example validation function
function validateConfig() {
    if (!config.application.token) {
        throw new Error("DISCORD_TOKEN environment variable is required");
    }
    
    if (process.env.NODE_ENV === "development" && !config.dev.guild) {
        throw new Error("Test guild ID is required for development mode");
    }
    
    // Validate AI module if enabled
    if (config.llama.apiUrl && !config.llama.model) {
        logger.warning("LLAMA_API_URL is set but LLAMA_MODEL is not");
    }
}

// Call at startup
validateConfig();
```

## Future Enhancements

Potential configuration improvements:

1. **Config file support**: Load from JSON/YAML files
2. **Environment-specific configs**: dev.config.ts, prod.config.ts
3. **Validation library**: Use Zod or Joi for schema validation
4. **Hot reload**: Update config without restarting (where safe)
5. **Override mechanism**: Command-line args override env vars
6. **Secrets management**: Integration with HashiCorp Vault, AWS Secrets Manager

## Related Documentation

- [Client System](./02-client-system.md) - Uses path configuration
- [Logger System](./06-logger-system.md) - Uses path and color configuration
- [Module System](./03-module-system.md) - Modules loaded from config.path.modules
- [Installation: Environment Configuration](../02-installation-deployment/03-environment-configuration.md)

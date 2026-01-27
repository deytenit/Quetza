# 3.6 Logger System

The Logger System provides centralized logging capabilities throughout Quetza using the Winston logging library. All modules use the same logger instance for consistent logging behavior and output formatting.

## 3.6.1 Winston Integration

Quetza uses [Winston](https://github.com/winstonjs/winston) as its logging framework:

```typescript
// src/lib/logger.ts
import path from "path";
import winston from "winston";
import config from "$config.js";

const errorLog = path.join(config.path.log, "error.log");
const combinedLog = path.join(config.path.log, "combined.log");

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ 
            format: winston.format.simple() 
        }),
        new winston.transports.File({ 
            filename: errorLog, 
            level: "error" 
        }),
        new winston.transports.File({ 
            filename: combinedLog 
        })
    ]
});

export default logger;
```

### Singleton Pattern

The logger is a **singleton**: one instance is created and exported for use throughout the application.

```typescript
// Import logger anywhere
import logger from "$lib/logger.js";

// Use logger
logger.info("Application started");
```

### Why Winston?

Winston provides:
- **Multiple transports**: Console, file, HTTP, etc.
- **Log levels**: Categorize log importance
- **Structured logging**: JSON format for machine parsing
- **Flexible formatting**: Different formats per transport
- **Performance**: Efficient async logging
- **Extensibility**: Custom transports and formats

## 3.6.2 Logging Levels

Quetza uses **syslog severity levels** (RFC 5424):

```typescript
levels: winston.config.syslog.levels
```

### Available Levels

| Level | Priority | Purpose | Usage in Quetza |
|-------|----------|---------|-----------------|
| `emerg` | 0 | Emergency: system is unusable | (Not currently used) |
| `alert` | 1 | Alert: action must be taken immediately | (Not currently used) |
| `crit` | 2 | Critical: critical conditions | (Not currently used) |
| `error` | 3 | Error: error conditions | Command failures, uncaught exceptions |
| `warning` | 4 | Warning: warning conditions | Deprecated features, recoverable errors |
| `notice` | 5 | Notice: normal but significant condition | Invalid interactions, missing commands |
| `info` | 6 | Informational: informational messages | Application status, command execution |
| `debug` | 7 | Debug: debug-level messages | Detailed diagnostic information |

### Commonly Used Levels

#### error

Critical errors that need attention:

```typescript
logger.error("Command execution failed", {
    error: error,
    command: commandName,
    user: interaction.user.tag
});
```

#### warning

Recoverable issues or deprecations:

```typescript
logger.warning("Deprecated configuration option used", {
    option: optionName,
    replacement: newOptionName
});
```

#### notice

Significant events that aren't errors:

```typescript
logger.notice("Interaction is not a ChatInputCommand.", {
    type: interaction.type
});
```

#### info

Standard operational messages:

```typescript
logger.info("Production mode: Commands will be pushed to the application!", 
    client.generateApplicationStatus()
);
```

#### debug

Detailed diagnostic information:

```typescript
logger.debug("Player state changed", {
    guildId: player.guild.id,
    state: player.state,
    queueLength: player.queue.list.length
});
```

### Level Hierarchy

Each level includes all messages at higher priority levels:

```
emerg ← alert ← crit ← error ← warning ← notice ← info ← debug
```

Example: If minimum level is `info`, logs at `info`, `notice`, `warning`, `error`, `crit`, `alert`, and `emerg` are captured.

## 3.6.3 Log Transports

Transports determine where log messages are sent. Quetza uses three transports:

### 1. Console Transport

Outputs to stdout/stderr for development and debugging:

```typescript
new winston.transports.Console({ 
    format: winston.format.simple() 
})
```

**Format:** Human-readable simple format
**Output:** Terminal/console
**Levels:** All levels
**Use case:** Development, Docker logs, debugging

**Example output:**
```
info: Production mode: Commands will be pushed to the application!
error: Command execution failed
```

### 2. Error File Transport

Captures only error-level messages to a dedicated file:

```typescript
new winston.transports.File({ 
    filename: errorLog,    // log/error.log
    level: "error"         // Only error and above
})
```

**Format:** JSON with timestamps
**Output:** `log/error.log`
**Levels:** error, crit, alert, emerg
**Use case:** Error monitoring, debugging failures

**Example output:**
```json
{
    "level": "error",
    "message": "Command execution failed",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "error": {
        "name": "MusicError",
        "message": "No active player",
        "code": "NO_PLAYER"
    }
}
```

### 3. Combined File Transport

Captures all log messages:

```typescript
new winston.transports.File({ 
    filename: combinedLog  // log/combined.log
})
```

**Format:** JSON with timestamps
**Output:** `log/combined.log`
**Levels:** All levels
**Use case:** Comprehensive logging, audit trails, analysis

**Example output:**
```json
{
    "level": "info",
    "message": "Interaction was created.",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "commandName": "play",
    "userId": "123456789"
}
```

### Transport Configuration

Log file paths are configured in `config.ts`:

```typescript
// config.ts
const loggerDir = join(rootDir, "/log/");

const path = {
    root: rootDir,
    modules: modulesDir,
    binaries: binariesDir,
    log: loggerDir
};
```

Ensure the log directory exists or is created at startup.

## 3.6.4 Log Formatting

Quetza uses different formats for different transports:

### Console Format (Simple)

```typescript
winston.format.simple()
```

**Output:**
```
info: Application started
error: Command failed: play
```

**Characteristics:**
- Human-readable
- No timestamps (rely on terminal/container timestamps)
- Brief and clear
- Good for development

### File Format (JSON + Timestamp)

```typescript
winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
)
```

**Output:**
```json
{
    "level": "info",
    "message": "Application started",
    "timestamp": "2024-01-15T10:30:00.123Z"
}
```

**Characteristics:**
- Machine-parseable
- Includes precise timestamps
- Structured data
- Easy to analyze with tools

### Structured Logging

Winston supports structured logging with metadata:

```typescript
logger.info("Player was created.", { 
    player: {
        guildId: player.guild.id,
        channelId: player.channel.id
    }
});
```

**JSON output:**
```json
{
    "level": "info",
    "message": "Player was created.",
    "timestamp": "2024-01-15T10:30:00.123Z",
    "player": {
        "guildId": "123456789",
        "channelId": "987654321"
    }
}
```

### Timestamp Format

Winston's default timestamp format is ISO 8601:

```
2024-01-15T10:30:00.123Z
```

This is:
- Sortable
- Timezone-aware (UTC)
- Standardized
- Parseable by most log analysis tools

## 3.6.5 Error Logging

Errors are logged with context for debugging:

### Basic Error Logging

```typescript
try {
    await riskyOperation();
} catch (error) {
    logger.error("Operation failed", error);
}
```

### Error with Context

```typescript
try {
    await command.execute(client, interaction, controller);
} catch (error) {
    logger.error("Interaction has and error occured.", error, interaction);
}
```

This logs:
- Error object (name, message, stack trace)
- Interaction details (command name, user, guild, etc.)
- Timestamp

### Structured Error Logging

```typescript
logger.error("Failed to connect to voice channel", {
    error: {
        name: error.name,
        message: error.message,
        code: error.code
    },
    context: {
        guildId: guild.id,
        channelId: channel.id,
        userId: user.id
    }
});
```

### Error Objects in JSON

Winston automatically serializes error objects:

```typescript
logger.error("Command failed", {
    error: new MusicError("No active player", "NO_PLAYER"),
    command: "play"
});
```

**Output:**
```json
{
    "level": "error",
    "message": "Command failed",
    "timestamp": "2024-01-15T10:30:00.123Z",
    "error": {
        "name": "MusicError",
        "message": "No active player",
        "code": "NO_PLAYER",
        "stack": "MusicError: No active player\n    at ..."
    },
    "command": "play"
}
```

### Stack Traces

Winston includes stack traces for Error objects:

```typescript
const error = new Error("Something went wrong");
logger.error("Unexpected error", error);
```

The stack trace appears in the `stack` property of the logged error object.

## 3.6.6 Log File Management

### File Rotation

Quetza doesn't currently implement automatic log rotation, but it's recommended for production:

#### Option 1: External Tool (logrotate)

Use Linux's `logrotate`:

```bash
# /etc/logrotate.d/quetza
/path/to/quetza/log/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    copytruncate
}
```

#### Option 2: Winston Daily Rotate File

Add the `winston-daily-rotate-file` transport:

```typescript
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
    transports: [
        new DailyRotateFile({
            filename: 'quetza-%DATE%.log',
            dirname: config.path.log,
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});
```

### File Size Monitoring

Monitor log file sizes to prevent disk space issues:

```bash
# Check log file sizes
du -h /path/to/quetza/log/

# Set up alerts for large files
find /path/to/quetza/log/ -type f -size +100M
```

### Manual Cleanup

Periodically clean old logs:

```bash
# Delete logs older than 30 days
find /path/to/quetza/log/ -name "*.log" -mtime +30 -delete

# Archive logs
tar -czf logs-$(date +%Y%m%d).tar.gz log/*.log
rm log/*.log
```

### Docker Log Management

When running in Docker, container logs capture console output:

```bash
# View logs
docker logs quetza

# Follow logs
docker logs -f quetza

# Limit log size in docker-compose.yml
services:
  quetza:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Usage Examples

### In Commands

```typescript
// modules/music/commands/play.ts
import logger from "$lib/logger.js";

async function execute(
    client: Client,
    interaction: CommandInteraction,
    controller?: unknown
): Promise<void> {
    logger.info("Play command invoked", {
        user: interaction.user.tag,
        guild: interaction.guild?.name,
        query: interaction.options.getString("query")
    });

    try {
        const music = controller as Music;
        const player = music.get(interaction.guild) ?? music.set(interaction.guild, interaction.channel);
        
        await player.add(query);
        
        logger.debug("Track added to queue", {
            guild: interaction.guild.id,
            queueLength: player.queue.list.length
        });
        
    } catch (error) {
        logger.error("Play command failed", {
            error: error,
            user: interaction.user.tag,
            query: query
        });
        
        throw error;
    }
}
```

### In Events

```typescript
// modules/core/events/ready.ts
import logger from "$lib/logger.js";

async function execute(client: Client<true>): Promise<void> {
    logger.info(
        "Production mode: Commands will be pushed to the application!",
        client.generateApplicationStatus()
    );

    try {
        await client.application.commands.set(commandData);
        logger.info("Slash commands registered successfully");
    } catch (error) {
        logger.error("Failed to register slash commands", error);
    }
}
```

### In Controllers

```typescript
// modules/music/lib/music.ts
import logger from "$lib/logger.js";

export default class Music {
    public set(guild: Guild, channel: GuildTextBasedChannel): Player {
        const player = new Player(guild, this, channel);
        this.players_.set(guild.id, player);
        
        logger.info("Player was created.", { 
            player: {
                guildId: guild.id,
                guildName: guild.name,
                channelId: channel.id
            }
        });
        
        return player;
    }

    public delete(guildId: string): void {
        logger.info("Player was deleted.", { guildId });
        this.players_.delete(guildId);
    }
}
```

### In Utility Functions

```typescript
// Custom utility function
import logger from "$lib/logger.js";

export async function fetchTrackInfo(url: string): Promise<TrackInfo> {
    logger.debug("Fetching track info", { url });
    
    try {
        const info = await ytdlp.getInfo(url);
        logger.debug("Track info retrieved", { 
            title: info.title,
            duration: info.duration 
        });
        return info;
    } catch (error) {
        logger.error("Failed to fetch track info", { error, url });
        throw error;
    }
}
```

## Best Practices

1. **Use appropriate levels**: Don't use `error` for informational messages
2. **Include context**: Add relevant data to understand what happened
3. **Structured data**: Use objects for metadata, not string concatenation
4. **Don't log sensitive data**: Avoid tokens, passwords, personal information
5. **Be consistent**: Use similar messages for similar events
6. **Log at boundaries**: Log when entering/exiting modules or major operations
7. **Trace execution flow**: Info for major steps, debug for details
8. **Error context**: Always include error object and relevant context
9. **Avoid excessive logging**: Don't log in tight loops
10. **Consider privacy**: Follow GDPR and Discord ToS regarding user data

## Logger Methods

```typescript
// Error and critical issues
logger.emerg(message, meta?)
logger.alert(message, meta?)
logger.crit(message, meta?)
logger.error(message, meta?)

// Warnings and notices
logger.warning(message, meta?)
logger.notice(message, meta?)

// Informational and debug
logger.info(message, meta?)
logger.debug(message, meta?)
```

**Parameters:**
- `message`: String describing the log event
- `meta`: Optional object with additional structured data

## Log Output Locations

### Development

- **Console**: Visible in terminal
- **Files**: `log/combined.log` and `log/error.log`

### Production (Docker)

- **Console**: Captured by Docker as container logs
- **Files**: Persist in mounted volume
- **Docker logs**: `docker logs quetza`

### Analysis

Log files can be analyzed with:
- `grep`, `awk`, `sed` for simple queries
- `jq` for JSON parsing
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Grafana Loki
- Splunk

## Related Documentation

- [Configuration Management](./07-configuration-management.md) - Log path configuration
- [Event System](./05-event-system.md) - Logging in event handlers
- [Command System](./04-command-system.md) - Logging in commands
- [Development Guide: Debugging](../05-development-guide/10-debugging.md)

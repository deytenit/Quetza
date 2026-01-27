# 3.8 Type System

Quetza's type system leverages TypeScript to provide compile-time safety, better IDE support, and clear contracts between components. All core types are defined in `src/lib/types.ts`.

## 3.8.1 TypeScript Configuration

Quetza uses a multi-project TypeScript setup with project references.

### Root Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "types": ["node"],
    
    "outDir": "./dist",
    "sourceMap": true,
    
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    "target": "ES2022",
    
    "skipLibCheck": true
  },
  "references": [
    { "path": "./modules/core" },
    { "path": "./modules/music" },
    { "path": "./modules/ai" }
  ]
}
```

### Key Compiler Options

| Option | Value | Purpose |
|--------|-------|---------|
| `strict` | `true` | Enable all strict type checking |
| `module` | `NodeNext` | ES module support with Node.js |
| `moduleResolution` | `NodeNext` | Node.js module resolution |
| `target` | `ES2022` | Modern JavaScript features |
| `outDir` | `./dist` | Compiled output directory |
| `sourceMap` | `true` | Generate source maps for debugging |

### Path Aliases

Configured in a shared config file:

```json
// config.tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$config.js": ["./config.ts"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

**Usage:**
```typescript
import config from "$config.js";        // Alias to ./config.ts
import Client from "$lib/client.js";    // Alias to ./src/lib/client.ts
import logger from "$lib/logger.js";    // Alias to ./src/lib/logger.ts
```

**Resolution:**
- TypeScript compiler recognizes aliases
- `tsc-alias` resolves them in compiled output

### Project References

Enable incremental compilation and better module isolation:

```json
{
  "references": [
    { "path": "./modules/core" },
    { "path": "./modules/music" },
    { "path": "./modules/ai" }
  ]
}
```

Each module has its own `tsconfig.json`:

```json
// modules/music/tsconfig.json
{
  "extends": "../../config.tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "../../dist/modules/music",
    "rootDir": "./"
  }
}
```

**Benefits:**
- Faster rebuilds (only changed modules recompile)
- Better IDE performance
- Type checking across project boundaries

## 3.8.2 Core Type Definitions

All core types are defined in `src/lib/types.ts`:

```typescript
import { ApplicationCommandData, CommandInteraction, If } from "discord.js";
import Client from "$lib/client.js";

export interface ModuleBase {
    name: string;
    description: string;
    controller?: unknown;
}

export interface Module extends ModuleBase {
    commands: CommandBase[];
    events: EventBase[];
}

export interface CommandBase {
    data: ApplicationCommandData;
    execute: (
        client: Client,
        interaction: CommandInteraction,
        controller?: unknown
    ) => Promise<void>;
}

export interface Command extends CommandBase {
    module: Module;
}

export interface EventBase {
    name: string;
    execute: (
        client: Client,
        eventee: unknown[],
        controller?: unknown
    ) => Promise<void>;
}

export interface Event extends EventBase {
    module: ModuleBase;
}

export interface ApplicationStatus<Ready extends boolean = boolean> {
    applicationId: If<Ready, string>;
    tag: If<Ready, string>;
    modules: Module[];
}
```

### Type Hierarchy

```
ModuleBase ────extends───> Module
     │                        │
     │                        ├─> commands: CommandBase[]
     │                        └─> events: EventBase[]
     │
CommandBase ───extends───> Command
     │                        └─> module: Module
     │
EventBase ─────extends───> Event
                             └─> module: ModuleBase
```

## 3.8.3 Module Types

### ModuleBase

The minimal module definition:

```typescript
export interface ModuleBase {
    /** Name of a module. */
    name: string;

    /** Description of a module. */
    description: string;

    /** Module controller. */
    controller?: unknown;
}
```

**Properties:**
- `name`: Unique identifier (lowercase, no spaces)
- `description`: Brief module description
- `controller`: Optional controller instance (typed as `unknown` for flexibility)

**Implementation:**
```typescript
// modules/music/module.ts
const name = "music";
const description = "Music module";
const controller = new Music();

export { controller, description, name };
```

### Module

The complete module with registered commands and events:

```typescript
export interface Module extends ModuleBase {
    /** Module's commands. */
    commands: CommandBase[];

    /** Module's events. */
    events: EventBase[];
}
```

**Properties:**
- Inherits: `name`, `description`, `controller`
- Adds: `commands[]`, `events[]`

**Created by:** Client during module loading

**Usage:**
```typescript
const musicModule = client.modules.get('music');
console.log(musicModule.commands.length);  // Number of commands
console.log(musicModule.events.length);    // Number of events
```

### Controller Typing

Controllers are typed as `unknown` in the base interface:

```typescript
controller?: unknown;
```

**Type assertion in usage:**
```typescript
const music = controller as Music;
const ai = controller as AI;
```

**Why unknown:**
- Each module can have a different controller type
- Allows flexibility without complex generics
- Forces explicit type assertion (safer than `any`)

## 3.8.4 Command Types

### CommandBase

The minimal command structure:

```typescript
export interface CommandBase {
    /** Command metadata that will be passed to the Discord API. */
    data: ApplicationCommandData;

    /** Function that will be executed upon invoking this interaction. */
    execute: (
        client: Client,
        interaction: CommandInteraction,
        controller?: unknown
    ) => Promise<void>;
}
```

**Properties:**
- `data`: Discord.js command metadata (from SlashCommandBuilder)
- `execute`: Async function handling command logic

**Implementation:**
```typescript
// modules/core/commands/ping.ts
import { SlashCommandBuilder } from "discord.js";

async function execute(
    client: Client,
    interaction: CommandInteraction
): Promise<void> {
    await interaction.reply("Pong!");
}

const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Try to ping me.");

export { data, execute };
```

### Command

The complete command with module reference:

```typescript
export interface Command extends CommandBase {
    /** Module containing this Command. */
    module: Module;
}
```

**Created by:** Client during command registration

**Usage:**
```typescript
const pingCommand = client.commands.get('ping');
console.log(pingCommand.module.name);  // "core"
```

### Execute Function Signature

```typescript
type CommandExecute = (
    client: Client,
    interaction: CommandInteraction,
    controller?: unknown
) => Promise<void>;
```

**Parameters:**
- `client`: Full Quetza client instance
- `interaction`: Discord command interaction
- `controller`: Optional module controller

**Return:** Promise<void> (async, no return value)

### ApplicationCommandData

From Discord.js, represents command metadata:

```typescript
interface ApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    defaultMemberPermissions?: PermissionResolvable;
    dmPermission?: boolean;
}
```

**Created by:** SlashCommandBuilder

## 3.8.5 Event Types

### EventBase

The minimal event structure:

```typescript
export interface EventBase {
    /** Name of an event to listen. */
    name: string;

    /** Function that will be executed upon event emitting. */
    execute: (
        client: Client,
        eventee: unknown[],
        controller?: unknown
    ) => Promise<void>;
}
```

**Properties:**
- `name`: Discord event name (e.g., "ready", "interactionCreate")
- `execute`: Async function handling event logic

**Implementation:**
```typescript
// modules/core/events/ready.ts
import { Events } from "discord.js";

async function execute(client: Client<true>): Promise<void> {
    console.log(`Ready as ${client.user.tag}`);
}

const name = Events.ClientReady;

export { execute, name };
```

### Event

The complete event with module reference:

```typescript
export interface Event extends EventBase {
    /** Module containing this Event. */
    module: ModuleBase;
}
```

**Created by:** Client during event registration

**Usage:**
```typescript
const readyEvent = client.events.get('ready');
console.log(readyEvent.module.name);  // "core"
```

### Execute Function Signature

```typescript
type EventExecute = (
    client: Client,
    eventee: unknown[],
    controller?: unknown
) => Promise<void>;
```

**Parameters:**
- `client`: Full Quetza client instance
- `eventee`: Array of event-specific parameters
- `controller`: Optional module controller

**Return:** Promise<void> (async, no return value)

### Event Parameters (eventee)

The `eventee` array contains event-specific parameters:

```typescript
// ready event - no additional parameters
async function execute(client: Client<true>): Promise<void> {
    // client is the only parameter needed
}

// interactionCreate event - one parameter
async function execute(client: Client, eventee: [Interaction]): Promise<void> {
    const [interaction] = eventee;
}

// voiceStateUpdate event - two parameters
async function execute(client: Client, eventee: [VoiceState, VoiceState]): Promise<void> {
    const [oldState, newState] = eventee;
}
```

## 3.8.6 Application Status Types

### ApplicationStatus

Provides type-safe status information with conditional types:

```typescript
export interface ApplicationStatus<Ready extends boolean = boolean> {
    /** Discord's ID of an application. */
    applicationId: If<Ready, string>;

    /** Tag of a bot user. */
    tag: If<Ready, string>;

    /** List of each module imported. */
    modules: Module[];
}
```

### Conditional Typing with `If`

The `If` type from Discord.js provides conditional types:

```typescript
type If<T extends boolean, V> = T extends true ? V : null;
```

**Usage:**
- If `Ready` is `true`: Property type is `V`
- If `Ready` is `false`: Property type is `null`

### Type States

#### Before Ready

```typescript
const status: ApplicationStatus<false> = {
    applicationId: null,  // Type: null
    tag: null,            // Type: null
    modules: [...]        // Type: Module[]
};
```

#### After Ready

```typescript
const status: ApplicationStatus<true> = {
    applicationId: "123456",  // Type: string
    tag: "Quetza#1234",       // Type: string
    modules: [...]            // Type: Module[]
};
```

#### Unknown State (Default)

```typescript
const status: ApplicationStatus = {
    applicationId: ...,  // Type: string | null
    tag: ...,            // Type: string | null
    modules: [...]       // Type: Module[]
};
```

### Usage

```typescript
// Client method
public generateApplicationStatus(): ApplicationStatus {
    const modules = Array.from(this.modules.values());

    if (!this.isReady()) {
        return {
            applicationId: null,
            tag: null,
            modules
        };
    }

    return {
        applicationId: this.application.id,
        tag: this.user.tag,
        modules
    };
}
```

## Module-Specific Types

Modules can define their own types:

### Music Module Types

```typescript
// modules/music/lib/types.ts
export interface TrackBase {
    title: string;
    url: string;
    duration: number;
}

export interface Track extends TrackBase {
    id: string;
    requester: string;
}

export type LoopOption = "NONE" | "LOOP" | "SONG" | "AUTO";
```

### AI Module Types

```typescript
// modules/ai/lib/types.ts (hypothetical)
export interface LlamaMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface LlamaResponse {
    choices: {
        message: LlamaMessage;
    }[];
}
```

## Type Safety Benefits

### Compile-Time Checks

```typescript
// TypeScript catches this error at compile time
const command: Command = {
    data: undefined,  // Error: Type 'undefined' is not assignable to type 'ApplicationCommandData'
    execute: async () => {},
    module: musicModule
};
```

### IDE Autocomplete

TypeScript provides intelligent autocomplete:

```typescript
client.commands.  // IDE suggests: get, set, has, forEach, map, etc.
config.colors.    // IDE suggests: default, error, warning, info, success
```

### Refactoring Support

Renaming a property updates all references:

```typescript
// Rename ModuleBase.name to ModuleBase.moduleName
// All usages automatically update
```

### Type Guards

```typescript
if (client.isReady()) {
    // TypeScript knows client is Client<true> here
    const tag = client.user.tag;  // No error, user is defined
}
```

## Generic Types

### Client Generic

```typescript
class Client<T extends boolean = boolean> extends DiscordClient<T> {
    // T indicates ready state
}
```

**Usage:**
```typescript
function handleReady(client: Client<true>) {
    // Guaranteed ready
    console.log(client.user.tag);
}

function handleEvent(client: Client<boolean>) {
    // May or may not be ready
    if (client.isReady()) {
        console.log(client.user.tag);
    }
}
```

### Collection Generic

From Discord.js:

```typescript
class Collection<K, V> extends Map<K, V> {
    // K = key type, V = value type
}

client.commands: Collection<string, Command>
client.events: Collection<string, Event>
client.modules: Collection<string, Module>
```

## Type Utilities

### Type Imports

```typescript
import type { Command, Event, Module } from "$lib/types.js";
```

Using `import type` indicates type-only imports (erased at runtime).

### Type Assertions

```typescript
// Assert controller type
const music = controller as Music;

// Assert interaction type
const command = interaction as CommandInteraction;
```

### Type Guards

```typescript
// Discord.js type guards
if (interaction.isChatInputCommand()) {
    // interaction is ChatInputCommandInteraction
}

// Custom type guard
function isMusic(controller: unknown): controller is Music {
    return controller instanceof Music;
}
```

## Best Practices

1. **Use strict mode**: Enable all strict type checking
2. **Avoid `any`**: Use `unknown` and type assertions instead
3. **Define interfaces**: Create interfaces for structured data
4. **Type parameters**: Document generic type parameters
5. **JSDoc comments**: Add comments for public interfaces
6. **Import types**: Use `import type` for type-only imports
7. **Type guards**: Use type guards over type assertions when possible
8. **Readonly where applicable**: Mark properties as `readonly` if they shouldn't change
9. **Null checks**: Handle potential null/undefined values
10. **Module types**: Keep module-specific types in module directories

## Related Documentation

- [Client System](./02-client-system.md) - Client class with generics
- [Module System](./03-module-system.md) - Module type usage
- [Command System](./04-command-system.md) - Command type implementation
- [Event System](./05-event-system.md) - Event type implementation
- [Development Guide: Code Style](../05-development-guide/07-code-style-standards.md)

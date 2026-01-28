# Guides

## Primary Workflows and Path to Value

Quetza's value delivery centers on three primary workflows: extending the bot with new modules, deploying and operating the system, and managing module lifecycle across development and production environments. Each workflow represents a distinct path through the architecture, and understanding their sequence and dependencies is essential for effective system utilization.

## Module Development Workflow

The journey from concept to deployed feature follows a structured progression through the module creation process.

**Conceptualization Phase**: Begin by identifying the feature's scope and interaction model. Determine whether the feature requires persistent state (necessitating a controller), responds to Discord lifecycle events (requiring event handlers), or simply provides slash command functionality. This decision shapes the module's internal architecture.

**Structure Establishment**: Create a module directory within the modules directory, named semantically to reflect its purpose. Within this directory, establish the module.ts declaration file that serves as the module's manifest. This file exports the module's name, description, and optionally instantiates a controller. The controller, if needed, is typically implemented in a separate lib/ subdirectory for organizational clarity.

**Command Implementation**: For each user-facing capability, create a dedicated command file within the commands/ subdirectory. Each command exports two elements: a data object defining the slash command specification (name, description, parameters) and an execute function that handles the interaction. The execute function receives the Discord client, the interaction object, and the module's controller. Command implementations should remain stateless, delegating any state management to the controller.

**Event Subscription**: If the module needs to respond to Discord lifecycle events, create event handler files within the events/ subdirectory. Each event file exports a name (matching Discord.js event names like "ready" or "interactionCreate") and an execute function. Event handlers enable reactive functionality—playing sounds when users join voice channels, tracking message patterns, or responding to guild membership changes.

**Controller Design**: For stateful modules, the controller implements the service layer that manages resources across Discord guilds. Controllers typically maintain collections keyed by guild ID, creating and destroying resources as needed. The controller pattern ensures that resources are properly scoped and isolated between different Discord servers using the bot.

**Integration Validation**: Once the module structure is complete, restart the bot. The framework's automatic discovery mechanism loads the module, registers its commands with Discord, and binds its event handlers. Validate that commands appear in Discord's slash command interface and that event handlers execute as expected. This validation confirms that the module adheres to the required interfaces.

## Deployment and Operational Workflow

Moving from development to production involves understanding Quetza's containerized deployment model and environment configuration.

**Environment Preparation**: Quetza requires specific environment variables to function. The Discord token, obtained from Discord's Developer Portal, grants the bot authorization to connect and operate. Additional environment variables may be required by specific modules—the AI module, for instance, requires Llama API configuration. These variables should never be committed to version control; they are injected at deployment time.

**Containerized Deployment**: The canonical deployment path uses Docker. The provided Dockerfile compiles the TypeScript source, includes necessary external dependencies (like yt-dlp for the music module), and configures the runtime environment. The Docker image is published to a registry and can be deployed to any container orchestration platform. This approach ensures consistent runtime environments across development, staging, and production.

**Source Deployment Alternative**: For development or lightweight deployments, Quetza can run directly from source. This workflow involves installing dependencies via pnpm, compiling TypeScript to JavaScript using the build script, and executing the compiled output. While this approach offers faster iteration during development, it requires managing Node.js versions and external binary dependencies manually.

**Operational Monitoring**: Once deployed, Quetza exposes operational health through several mechanisms. The ping command validates both network latency and Discord API responsiveness. The modules command lists all loaded modules, confirming that the expected features are available. Logs, emitted through the Winston logger, provide insight into module initialization, command execution, and error conditions.

**Scaling Considerations**: Quetza follows Discord's single-instance-per-token model. Each bot token can only power one connected instance. For high-availability deployments, infrastructure must handle instance failure and restart rather than running multiple concurrent instances. Module state is ephemeral—controllers maintain in-memory collections that are lost on restart. Stateful features requiring persistence across restarts must implement external storage.

## Module Lifecycle Management

Understanding how modules transition through various states enables effective development iteration and production maintenance.

**Development Iteration**: During active development, modules undergo frequent modification. The workflow involves editing module code, rebuilding (which recompiles TypeScript and resolves path aliases), and restarting the bot. Command changes are immediately reflected, though Discord may cache command metadata briefly. For rapid testing, consider using a dedicated development guild rather than global command registration, as guild-specific commands update faster.

**Dependency Integration**: Modules may require external dependencies—Node.js packages or system binaries. JavaScript dependencies are declared in package.json and installed via pnpm. Binary dependencies (like yt-dlp) must be either included in the Docker image or made available in the system PATH. Module initialization should validate dependency availability and fail gracefully if requirements are unmet.

**Error Handling and Recovery**: Modules should implement defensive error handling. Commands must respond to interactions within Discord's three-second timeout, either with a reply or a deferral. Long-running operations should defer the interaction, process asynchronously, and edit the deferred response upon completion. Unhandled errors in commands result in user-facing interaction failures; modules should catch exceptions and present user-friendly error messages.

**Version Management**: As modules evolve, maintain backward compatibility with Discord's command interface. Changing a command's structure (adding required parameters, renaming commands) requires careful migration to avoid breaking user workflows. Discord's command metadata is eventually consistent—changes propagate over time, and users may see stale versions during transitions.

**Module Deprecation**: Removing a module is as simple as deleting its directory, but this breaks any active usage. For graceful deprecation, first disable the module by removing its commands (leaving the directory but clearing the commands/ folder), then communicate the deprecation to users, and finally remove the module after a transition period.

## Integration Patterns

Modules commonly follow several integration patterns that represent standardized paths to value.

**Simple Command Module**: The most basic pattern—a module exporting one or more stateless commands. These commands receive interactions, perform logic (often calling external APIs or performing calculations), and return results. No controller is needed. This pattern suits utility commands like ping checks, unit conversions, or API queries.

**Stateful Service Module**: Complex features require maintaining state across interactions. The pattern involves a controller that manages resources per guild, commands that invoke controller methods to manipulate state, and potentially events that react to Discord lifecycle changes affecting the resource. The music module exemplifies this pattern—managing audio players per guild.

**Event-Driven Module**: Some modules primarily react to Discord events rather than explicit commands. The pattern uses event handlers to observe Discord state changes and take action. For example, a moderation module might observe message events to detect spam patterns, or a presence module might track user activity patterns.

**Hybrid Module**: Many production modules combine all three patterns—commands for explicit user control, events for reactive behavior, and a controller for state management. The AI module demonstrates this: commands initiate conversations, events could track message context, and the controller manages conversation histories per user per guild.

## Operational Lifecycle

Understanding the complete operational lifecycle—from bot startup through steady-state operation to graceful shutdown—enables effective troubleshooting and system design.

**Initialization Sequence**: On startup, the client constructor reads the modules directory, importing each module's declaration. For each module, it loads all command files and event files, registering them in the appropriate collections. Finally, the client connects to Discord. Upon receiving the "ready" event, Quetza pushes all registered commands to Discord's API, making them available to users.

**Steady-State Operation**: During normal operation, Discord sends interaction events to the bot when users invoke commands. The core event handler (in the core module) routes interactions to the appropriate command based on the command name. The command executes, potentially invoking controller methods, and responds to the interaction. This request-response cycle is stateless from the framework's perspective—state lives in controllers.

**Resource Lifecycle**: Controllers manage resource lifecycles independently. An audio player might be created when a user first requests music in a guild and destroyed when the bot leaves the voice channel. Conversation histories might be created on first message and cleared when explicitly requested. These lifecycles are module-specific; the framework provides no lifecycle hooks beyond module initialization.

**Graceful Degradation**: When errors occur, modules should fail gracefully. Command execution errors should result in user-friendly error messages, not bot crashes. Missing dependencies should log warnings and disable affected features, not prevent the entire bot from starting. This resilience ensures that one module's failure doesn't cascade to unrelated functionality.

The path to value with Quetza is through understanding and operating within these workflows. Module development flows from structure establishment through implementation to integration. Deployment flows from environment configuration through containerization to operational monitoring. Lifecycle management flows from development iteration through version control to graceful deprecation. Mastering these flows enables efficient feature delivery and reliable operational characteristics.

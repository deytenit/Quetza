# Troubleshooting

## Conceptual Pitfalls and Mental Model Corrections

Most failures in Quetza-based systems stem not from bugs but from misalignments between developer mental models and architectural reality. This guide addresses these conceptual gaps, focusing on diagnostic approaches rather than specific error messages.

## Module Discovery and Loading Failures

When modules fail to load or aren't recognized by the framework, the root cause typically lies in violating the convention-based discovery contract.

**Structural Convention Misalignment**: The framework discovers modules through filesystem structure, not explicit registration. If a module doesn't load, the first diagnostic step is structural validation: Does the module directory exist in /modules/? Does it contain a module.ts file? Do command files reside in a commands/ subdirectory? Do event files reside in an events/ subdirectory? Any deviation from this structure renders the module invisible to the framework. The framework doesn't report missing conventions as errors—it simply doesn't find what isn't structured correctly.

**Export Interface Violations**: Modules, commands, and events must export specific properties. Modules export name, description, and optionally controller. Commands export data and execute. Events export name and execute. If these exports are missing or misspelled (exports.execute vs export function execute), the framework receives undefined values and fails silently or with cryptic errors. Diagnostic approach: validate that exports match the expected interface exactly, including property names and types.

**Build System Disconnects**: Quetza runs compiled JavaScript, not raw TypeScript. Developers edit .ts files, but the runtime loads .js files from the dist/ directory. If modules aren't loading after changes, the build step might have failed or not been executed. Diagnostic approach: verify that pnpm run build completed successfully and that the dist/ directory contains compiled versions of your modules with the same structure as src/.

**Path Resolution Issues**: TypeScript path aliases (like $lib or $mlib) enable clean imports during development but must resolve correctly after compilation. The tsc-alias tool handles this resolution during build. If imports fail at runtime, path alias resolution likely failed. Diagnostic approach: examine compiled .js files to ensure imports reference relative paths, not the original aliases.

## Command Registration and Visibility Issues

Commands defined in module code might not appear in Discord's slash command interface, or might appear but not execute correctly.

**Registration Timing Misunderstanding**: Commands are registered with Discord during the ready event, not at bot startup. There's a delay—potentially several seconds—between when the bot connects and when commands become available. Additionally, global command registration propagates slowly (up to an hour). For development, use guild-specific registration (configured via environment variables) for immediate availability. Diagnostic approach: if commands don't appear, wait several minutes for global propagation or configure dev guild registration.

**Command Data Malformation**: Discord has strict requirements for command structure—name format, parameter types, description length. If command data violates these requirements, Discord rejects the entire batch. Diagnostic approach: validate that command names are lowercase, alphanumeric with hyphens only, descriptions are within length limits, and option types match Discord's enumeration.

**Interaction Routing Failures**: Even if commands appear in Discord, they might fail to execute. The core module's interaction-create handler routes interactions to commands. If this handler is broken or a command's name doesn't match its data definition, routing fails. Diagnostic approach: check logs for interaction-create events and verify that the command name in the interaction matches the command name in the client.commands collection.

**Missing Interaction Responses**: Discord requires commands to respond within three seconds. If a command executes but doesn't reply, defer, or acknowledge the interaction, Discord shows "The application did not respond." This isn't a framework issue—it's a command implementation issue. Diagnostic approach: ensure every command execution path calls interaction.reply(), interaction.deferReply(), or interaction.editReply(). Long-running commands should defer immediately and edit the deferred response upon completion.

## State Management and Controller Confusion

Improper understanding of state lifecycle and controller patterns leads to resource leaks, cross-guild interference, and unexpected behavior.

**Controller Instance Confusion**: The controller exported by module.ts is instantiated once and shared across all guilds and all command invocations. It is not created per-command or per-guild. Misunderstanding this leads to treating controllers as request-scoped objects. Diagnostic approach: recognize that controllers are singleton services that manage multiple resources, not individual resources themselves.

**Guild Scoping Failures**: The most common state management error is failing to scope state by guild. Storing "the current player" as a single variable means all guilds share one player, causing interference. Diagnostic approach: always key resources by guild ID. When a command executes in Guild A, retrieve or create Guild A's resource, not a global resource.

**Lifecycle Leaks**: Resources created but never destroyed lead to memory leaks. Audio players, timers, and file handles must be explicitly cleaned up. The framework provides no automatic cleanup—controllers are responsible. Diagnostic approach: for every resource creation path, identify the corresponding destruction path. When does a player get destroyed? When the bot leaves voice. Implement this destruction logic.

**State Persistence Expectations**: Developers familiar with database-backed applications might expect state to persist across bot restarts. Quetza provides no persistence—all in-memory state is lost on restart. Diagnostic approach: if features require persistence across restarts, implement external storage (database, file system) and reload state during initialization.

**Concurrent Modification**: Multiple users in the same guild might simultaneously invoke commands that modify shared state. Without synchronization, race conditions occur. Diagnostic approach: identify shared mutable state and implement appropriate synchronization (locks, queues, or atomic operations). For many features, command serialization (processing one at a time) is sufficient.

## Event Handling Mental Model Errors

Event-driven features require understanding asynchronous event propagation and handler execution order.

**Multiple Handler Confusion**: Multiple modules can subscribe to the same event. When the event fires, all handlers execute. Developers sometimes expect exclusive handling—that registering a handler replaces previous handlers. Diagnostic approach: understand that event subscription is additive. If behavior seems duplicated, check whether multiple modules have handlers for the same event.

**Event Argument Misinterpretation**: Events receive arguments as an array, not as individual parameters. The execute function signature is (client, eventArgs, controller) where eventArgs is an array. Handlers must destructure this array to access individual arguments. Diagnostic approach: if event handlers receive undefined where data is expected, verify that the handler destructures the eventArgs array correctly.

**Asynchronous Execution Expectations**: Event handlers execute asynchronously relative to Discord's event emission. By the time a handler runs, Discord's state might have changed. For instance, a message-delete event handler might attempt to access the deleted message, which no longer exists. Diagnostic approach: understand that events represent historical notifications, and current state might differ from event state.

**Event Ordering Assumptions**: Don't assume events fire in a specific order or that one event completes before another starts. Event handlers execute concurrently. Diagnostic approach: if logic depends on sequential event processing, implement explicit ordering through queues or locks rather than relying on event timing.

## Discord API Interaction Misunderstandings

Quetza provides minimal abstraction over Discord's API, meaning Discord's constraints apply directly to modules.

**Permission and Context Requirements**: Commands execute in specific contexts—guild channels, DMs, voice channels. Some operations require the bot to have specific permissions. Attempting operations without required context or permissions fails. Diagnostic approach: validate context early in command execution. Check that the interaction is in a guild (interaction.inGuild()), that the bot has necessary permissions, and that required resources (like voice channels) exist before attempting operations.

**Rate Limiting Realities**: Discord rate-limits API calls. Modules making frequent API calls might hit limits, causing temporary failures. Diagnostic approach: implement client-side rate limiting for high-frequency operations. Cache Discord data where possible to reduce API calls. Respect Discord's retry-after headers when rate-limited.

**Interaction Type Confusion**: Discord has multiple interaction types—slash commands, buttons, modals, autocomplete. The interaction object's type determines available methods. Calling reply() on a modal submission or expecting commandOptions on a button interaction fails. Diagnostic approach: check interaction type before processing and implement type-specific handling.

## Environment and Configuration Issues

Modules often depend on environment variables or external configuration that might be missing or incorrect.

**Missing Environment Variables**: Modules requiring API credentials or configuration values should validate these during initialization. If variables are missing at runtime, modules might fail in obscure ways. Diagnostic approach: implement explicit validation during controller construction. If required variables are absent, throw clear errors that identify the missing configuration.

**Configuration Type Mismatches**: Environment variables are strings. Expecting a number or boolean requires explicit parsing. Forgetting to parse leads to type errors or logic failures. Diagnostic approach: parse environment variables to expected types during initialization and validate that parsing succeeded.

**Development vs Production Configuration**: Development environments often use different configuration than production (test guilds, mock API endpoints, debug logging). Modules hardcoding development values fail in production. Diagnostic approach: externalize all environment-specific values and provide clear documentation of required configuration.

## External Dependency Failures

Modules integrating external services or binaries face unique failure modes.

**Binary Dependency Absence**: The music module requires yt-dlp binary. If this binary isn't in PATH or the expected location, the module fails when attempting to extract media. Diagnostic approach: validate binary availability during module initialization. Use child_process to check that required binaries exist and are executable.

**External API Unavailability**: Third-party APIs might be down, slow, or return unexpected responses. Modules must handle these failures gracefully. Diagnostic approach: implement timeout logic, retry with exponential backoff, and fail gracefully with user-friendly errors when external services are unavailable.

**Version Compatibility**: External dependencies might change their APIs or behavior across versions. Modules might work with one version but fail with another. Diagnostic approach: document required dependency versions and validate compatibility during initialization when possible.

## Debugging Strategies

When facing issues not covered by specific troubleshooting guidance, systematic debugging reveals root causes.

**Log-Driven Diagnosis**: Quetza uses Winston for logging. Instrument modules with debug logs at key points: module initialization, command execution start, controller method invocation, external API calls, error conditions. Logs provide execution traces that reveal where behavior deviates from expectations.

**Isolation and Elimination**: When multiple modules are loaded, isolate issues by temporarily removing unrelated modules. If the issue persists, it's not related to removed modules. If it disappears, one of the removed modules contributes to the issue. This binary search approach narrows the problem space.

**Discord Developer Portal Inspection**: Discord's developer portal shows registered commands, permissions, and bot configuration. If commands don't appear as expected, the portal reveals what Discord actually received during registration, not what the bot attempted to send.

**Reproduction in Minimal Environment**: Create a minimal module that reproduces the issue without unrelated complexity. This minimal reproduction isolates the problem from surrounding code and often reveals the root cause through simplification.

**Async Execution Tracing**: Many issues stem from misunderstanding asynchronous execution. Add console.log statements with timestamps to trace execution order. This reveals race conditions, out-of-order execution, and timing-dependent failures.

## Common Diagnostic Checkpoints

When troubleshooting any issue, systematically verify these checkpoints:

**Is the module structurally correct?** Validate directory structure, file names, and export interfaces against the required convention.

**Did the build succeed?** Verify that TypeScript compilation completed without errors and that dist/ contains expected files.

**Are environment variables set?** Confirm that required configuration values are available in the environment.

**Are external dependencies available?** Validate that required binaries and external services are accessible.

**Is Discord configuration correct?** Verify bot token, permissions, and guild settings in Discord's developer portal.

**Are logs revealing?** Check Winston logs for errors, warnings, or debug information that indicates the failure point.

**Does a minimal reproduction occur?** Test whether the issue persists in a simplified environment without unrelated modules.

These diagnostic strategies, combined with understanding common conceptual pitfalls, enable effective troubleshooting. Most issues stem from misalignment between mental models and architectural reality rather than bugs in the framework itself. By correcting these mental models and applying systematic diagnosis, developers resolve issues efficiently and develop more robust modules.

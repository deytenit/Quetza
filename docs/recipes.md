# Recipes

## Strategic Patterns for Common Use Cases

Quetza's modular architecture enables a variety of strategic patterns for solving business and functional requirements. These recipes describe high-level approaches to combining the framework's features, not implementation details, focusing on architectural decisions and composition strategies that deliver specific value propositions.

## Building Interactive Voice Features

Voice-based features represent one of Discord's most engaging capabilities, and Quetza's architecture supports sophisticated voice interactions through proper resource management and state coordination.

**Resource Scoping Strategy**: Voice features require maintaining state per Discord guild (server), as each guild has independent voice channels. The pattern involves a controller that manages a collection of guild-keyed resources—typically audio players or voice sessions. When a user first invokes a voice command, the controller creates a player for that guild. Subsequent commands in the same guild retrieve the existing player. When the bot disconnects or is explicitly stopped, the controller destroys the player and releases resources.

**Command Orchestration**: Voice features typically require multiple coordinated commands: connection establishment, content playback, playback control (pause, resume, skip), and disconnection. These commands share access to the guild's player through the controller. The connection command creates the player and joins the voice channel. Playback commands manipulate the player's state. Control commands adjust parameters like volume or position. Disconnection commands trigger cleanup.

**State Persistence Strategy**: Voice sessions are inherently ephemeral—they exist only while the bot is connected to a voice channel. The pattern preserves minimal state across disconnections by maintaining queues or playlists in the controller. When a user disconnects and reconnects, the queue persists, enabling resumption of playback. This requires separating transient state (the active audio stream) from durable state (the list of tracks to play).

**Multi-Guild Isolation**: A single bot instance often operates across many guilds simultaneously. Voice features must ensure complete isolation between guilds—playback in Guild A should never interfere with Guild B. The controller enforces this through strict keying: each guild ID maps to an independent player instance. Commands validate that the invoking user and the bot are in the same voice channel before operations, preventing cross-channel interference.

## Implementing Conversational AI Integrations

Conversational features add natural language interaction to Discord bots, requiring careful management of conversation context and appropriate scoping of conversation state.

**Context Management Strategy**: Conversations require maintaining message history to provide relevant responses. The pattern uses nested scoping: conversations are keyed by both guild ID and user ID, as conversations are personal but occur within guild contexts. The controller manages a two-level map (guild → user → conversation) to ensure conversation histories don't leak between users or across guilds.

**History Lifecycle**: Conversation histories grow unbounded if not managed. The strategic pattern involves automatic truncation: maintain a rolling window of recent messages (e.g., the last 50 exchanges) and discard older context. Additionally, implement staleness detection—conversations inactive for extended periods are candidates for cleanup, freeing memory. Provide users explicit control through clear commands that reset their conversation history.

**Response Streaming Strategy**: Large language models can take seconds to generate responses, exceeding Discord's interaction timeout. The pattern involves immediate interaction deferral, asynchronous LLM invocation, and editing the deferred response with the generated content. This keeps users informed that processing is occurring and delivers results as they become available.

**Multi-User Coordination**: In guild channels, multiple users might simultaneously invoke conversational commands. The pattern ensures each user maintains independent conversation state, even when interacting in the same channel. Responses should clearly indicate which user's prompt is being answered, preventing confusion when multiple conversations interleave in a channel.

## Creating Reactive Moderation Systems

Moderation features respond to Discord events automatically, requiring event-driven architectures and sophisticated state tracking.

**Event-Driven Observation**: Rather than explicit commands, moderation operates through event subscription. The pattern involves registering handlers for events like message creation, member join, message edit, and message delete. These handlers analyze event context and take action when patterns match moderation policies. For instance, observing message events to detect spam patterns or observing member join events to screen new users.

**Pattern Detection Strategy**: Effective moderation identifies problematic patterns across multiple events. The pattern maintains temporal state—tracking message frequency per user, link posting patterns, or rapid channel changes. Controllers store this temporal data, enabling pattern detection algorithms to span multiple events. When thresholds are exceeded, automated actions trigger (warnings, mutes, or kicks).

**Action Escalation Framework**: Moderation responses should escalate based on violation severity and frequency. The pattern implements a multi-tier response system: first violation might trigger a warning, repeated violations escalate to temporary mutes, persistent violations result in permanent actions. Controllers track violation histories per user, enabling this escalation logic.

**Human Override Mechanism**: Automated moderation requires human oversight. The pattern combines event-driven automation with command-driven manual intervention. Moderators should have commands to review automated decisions, override actions, whitelist users, or adjust sensitivity thresholds. This ensures automation enhances rather than replaces human judgment.

## Building Scheduled and Periodic Features

Some features require actions at scheduled times or periodic intervals, requiring lifecycle management beyond simple command-response patterns.

**Initialization Hook Strategy**: Scheduled features initialize during the bot's ready event. The pattern involves subscribing to the ready event, where the module establishes timers or intervals. These timers invoke functionality at specified times, even without user interaction. For instance, posting daily announcements, cleaning up stale data, or polling external APIs for updates.

**Cleanup Management**: Scheduled tasks must be properly cleaned up when the bot shuts down to prevent resource leaks. The pattern uses the controller to store timer references, enabling cancellation before the bot disconnects. While Quetza doesn't provide shutdown hooks, modules can register cleanup logic that the infrastructure invokes during graceful shutdown.

**Guild-Specific Scheduling**: Scheduled features often operate per-guild (e.g., guild-specific announcement schedules). The pattern creates independent timers per guild, each with guild-specific configuration. The controller manages a collection of guild-keyed schedulers. When guilds configure their schedules through commands, the controller creates or updates the appropriate timer.

**Resilience to Restarts**: Timers are lost when the bot restarts. For features requiring persistent schedules, the pattern involves external state storage. On initialization, the module reads scheduled tasks from storage and re-establishes timers. This ensures schedules survive bot restarts, though immediate execution might be missed during downtime.

## Composing Multi-Module Experiences

Complex bot behaviors often span multiple modules, requiring coordination strategies that respect module boundaries while delivering cohesive user experiences.

**Shared State Through Discord**: Modules cannot directly communicate, but they can coordinate through Discord's shared state. For instance, a moderation module might assign roles that a feature module checks to gate access. This pattern uses Discord entities (roles, channels, message reactions) as coordination mechanisms, enabling indirect module interaction.

**Consistent User Experience**: Even with independent modules, users expect consistent interaction patterns. The strategic pattern involves establishing conventions across modules: consistent error message formatting, unified command naming schemes, and standard permission checking. While these conventions aren't enforced by the framework, they create cohesion across otherwise independent features.

**Configuration Centralization**: Multiple modules might require similar configuration (admin roles, announcement channels, API credentials). The pattern centralizes configuration in environment variables or a shared configuration module. Individual modules read from this central source, ensuring consistency without tight coupling. Changes to configuration affect all dependent modules simultaneously.

**Capability Discovery**: Users need to understand what a multi-module bot can do. The pattern provides discovery commands (like the modules command in the core module) that enumerate available capabilities. Each module clearly describes its purpose and primary commands, enabling users to explore the bot's full feature set.

## Implementing External Integration Features

Many modules integrate with external services—APIs, databases, or third-party platforms. These integrations require specific strategic patterns to maintain reliability and security.

**Credential Management Strategy**: External services require authentication credentials. The pattern stores credentials in environment variables, not in code or configuration files committed to version control. Modules read these variables during controller initialization and fail gracefully with clear error messages if credentials are missing. This enables different credential sets across development, staging, and production environments.

**API Client Abstraction**: Modules should wrap external API clients in service classes within the lib/ directory. This abstraction provides a stable interface for commands while encapsulating the external service's details. If the external API changes, only the service class needs updating, not all commands using it. This also facilitates testing through mock implementations.

**Rate Limiting Respect**: External services often impose rate limits. The pattern implements client-side rate limiting within the service abstraction, queuing requests that would exceed limits. This prevents service disruption and provides predictable behavior to users. When limits are approached, commands might defer responses or queue operations for later execution.

**Failure Handling Strategy**: External integrations can fail for many reasons—network issues, service outages, invalid requests. The pattern implements robust error handling: catch integration failures, translate them to user-friendly messages, and implement retry logic with exponential backoff for transient failures. Commands should never expose raw API errors to users.

## Building Permission-Aware Features

Discord bots often need to restrict functionality based on user roles or permissions, requiring strategic patterns for authorization enforcement.

**Permission Checking Strategy**: Commands that perform privileged operations should validate user permissions before execution. The pattern checks the interaction member's roles or permissions against required criteria. Only users meeting requirements can execute the command. This check occurs early in command execution, before any state changes or external API calls.

**Role-Based Access Control**: Rather than checking individual permissions, the pattern uses Discord roles as authorization groups. Modules define required roles (configured via environment variables or command configuration), and commands check for role membership. This provides flexibility—server administrators can grant access by assigning roles without modifying the bot.

**Graceful Denial Pattern**: When users lack required permissions, commands should provide clear feedback explaining why access was denied and how to obtain necessary permissions. This educational approach helps users understand the bot's security model rather than frustrating them with opaque errors.

**Escalation Pathways**: Some features might have multi-tier access: basic functionality for all users, advanced features for moderators, and administrative features for server owners. The pattern implements tiered permission checks, enabling different levels of capability based on user roles. This creates a privilege escalation pathway that aligns with Discord's role hierarchy.

These strategic patterns represent proven approaches to solving common functional requirements within Quetza's architectural constraints. By combining these patterns, developers can build sophisticated, reliable, and user-friendly Discord bot features that leverage the framework's modularity while maintaining clean separation of concerns.

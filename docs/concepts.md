# Concepts

## Underlying Philosophy and Design Principles

Quetza's architecture emerges from a deliberate philosophical stance on software modularity, extensibility, and the relationship between framework and feature code. Understanding these philosophical underpinnings enables developers to make decisions aligned with the system's design intent.

**Convention Over Configuration**: The framework privileges convention-based discovery over explicit configuration. Rather than maintaining a central registry of modules, the system infers module presence from filesystem structure. This philosophy reduces cognitive overhead—developers don't maintain two sources of truth (code and configuration). The convention is rigid by design; this rigidity creates reliability and predictability.

**Composition Over Inheritance**: Modules extend functionality through composition rather than subclassing. There is no Module base class to inherit from; instead, modules conform to structural interfaces through exported properties. This approach enables flexibility—modules can use any internal architecture—while maintaining the interface contract that enables framework integration.

**Explicit Over Implicit**: The framework makes dependencies and relationships explicit. Controllers are explicitly passed to commands and events, not magically injected. Module structure is explicitly visible in the filesystem, not hidden in configuration files. This explicitness trades convenience for clarity, but the clarity simplifies debugging and reasoning about system behavior.

**Isolation Over Integration**: Modules operate independently, unable to directly invoke other modules' functionality. This isolation might seem limiting, but it prevents tight coupling and ensures modules can be added, removed, or replaced without cascading changes. The constraint forces design decisions that favor loose coupling and clear boundaries.

## Core Entities and Their Relationships

The Quetza architecture comprises several core entities, each with specific responsibilities and relationships to other entities.

**The Client**: The client is the system's orchestrator and primary entry point. It extends Discord.js's base client with three collections: commands, events, and modules. The client's lifecycle drives the entire system—module discovery occurs during client construction, command registration happens on the ready event, and interaction routing operates through client event handlers. The client is singular—there is one client instance per bot process.

**Modules**: Modules are the primary abstraction for feature grouping. A module is conceptually a namespace that contains related commands, events, and optionally a controller. Modules have no runtime representation beyond their metadata (name, description) and their controller instance. The module serves as an organizational boundary—it groups related functionality and provides a scope for state management through its controller.

**Commands**: Commands represent user-facing interactions—Discord slash commands that users invoke through the Discord UI. Each command maps to a specific interaction handler. Commands are stateless; they receive context (client, interaction, controller) and produce effects (Discord responses, controller state mutations). Commands are the primary user interface to bot functionality.

**Events**: Events represent reactions to Discord lifecycle changes. Unlike commands, which respond to explicit user invocations, events fire automatically when Discord state changes—users join channels, messages are sent, guilds are joined. Events enable reactive functionality and background processing. Multiple modules can subscribe to the same event, with each subscription executing independently.

**Controllers**: Controllers are service objects that manage module-specific state and business logic. They implement the service locator pattern, typically maintaining collections of resources keyed by guild ID or user ID. Controllers bridge stateless command execution with stateful feature behavior. Controllers are optional—simple modules operate without them, while complex modules rely on controllers for resource lifecycle management.

**Collections**: Discord.js Collections (extended JavaScript Maps) serve as the primary data structure for managing relationships. The client maintains collections of commands, events, and modules. Controllers maintain collections of guild-specific or user-specific resources. Collections provide efficient keyed access and enumeration, supporting the lookup patterns central to request routing and resource retrieval.

## The Module System Vocabulary

Effective communication about Quetza requires understanding the system's vocabulary—the terms that describe its components and their interactions.

**Module Declaration**: The module.ts file that exports a module's metadata. This declaration includes the module's name (used for identification), description (for documentation), and optionally a controller instance. The declaration is the module's entry point—the framework loads this file first when discovering modules.

**Command Registration**: The process of informing Discord's API about available slash commands. During the ready event, Quetza collects all command data objects and submits them to Discord. Discord validates the commands and makes them available in its UI. Registration can be global (across all guilds using the bot) or guild-specific (for testing or guild-exclusive features).

**Event Binding**: The process of subscribing handler functions to Discord events. When a module exports an event, Quetza registers that event's execute function as a listener on the Discord client. When Discord emits the event, all bound handlers execute. Event binding is automatic—creating an event file is sufficient to establish the subscription.

**Controller Injection**: The process of providing the controller instance to command and event execute functions. The framework passes the controller as the third argument to these functions. This injection is how stateless handlers access stateful services—the controller reference provides access to module state management.

**Guild Scoping**: The pattern of keying resources by Discord guild ID. Most stateful features operate per-guild—each guild has independent configuration, independent resource instances, and independent user populations. Guild scoping ensures isolation between different communities using the same bot.

**Interaction Lifecycle**: The sequence of stages an interaction undergoes: invocation (user triggers command), routing (framework finds command handler), execution (command logic runs), and response (Discord receives reply). Understanding this lifecycle is crucial for proper command implementation—commands must respond within timeout windows and handle errors appropriately.

## Architectural Patterns in Quetza

Several well-known architectural patterns manifest in Quetza's design, and recognizing these patterns clarifies system behavior.

**Plugin Architecture**: Modules function as plugins—self-contained packages that extend the host system without modifying it. The host (Quetza core) provides extension points (the module interface), and plugins (modules) implement those extension points. This pattern enables the framework to remain stable while functionality expands.

**Service Locator**: Controllers implement service locator pattern—they maintain registries of services (resources) and provide retrieval methods. Commands ask the controller for the service they need (e.g., "get the player for this guild"), and the controller returns it, creating it if necessary. This pattern centralizes resource lifecycle management.

**Observer Pattern**: Event handling implements the observer pattern. Discord is the subject, emitting notifications of state changes. Modules are observers, subscribing to specific events. When the subject's state changes, it notifies all observers. This pattern enables reactive functionality without tight coupling between the event source and event handlers.

**Template Method**: The command and event interfaces define a template for execution. The framework calls execute methods at specific lifecycle points, passing standard parameters. Modules implement these templates, filling in the behavior. This pattern ensures uniform invocation while enabling customized behavior.

**Lazy Initialization**: Controllers often use lazy initialization for resources. Rather than creating all possible resources upfront, controllers create resources on-demand when first needed. This conserves memory and reduces startup time, creating only the resources actually used.

## Relationship Between Modules and Discord API

Understanding how Quetza mediates between modules and Discord's API clarifies the system's role and boundaries.

**Abstraction Level**: Quetza provides minimal abstraction over Discord.js. Commands receive raw interaction objects; events receive raw Discord event arguments. The framework doesn't attempt to hide Discord's complexity—it organizes access to it. This design decision means modules must understand Discord's API, but it also means the framework doesn't become outdated as Discord evolves.

**Command Translation**: Commands define their structure using Discord's ApplicationCommandData format. Quetza doesn't invent its own command description language; it uses Discord's. This direct mapping means Discord documentation applies directly to Quetza modules. When Discord adds new command features (buttons, modals, autocomplete), modules can immediately leverage them without framework updates.

**Event Passthrough**: When Discord emits events, Quetza passes them through to subscribed handlers with minimal processing. The framework doesn't filter, transform, or enrich event data—it routes it. This passthrough design keeps the framework thin and prevents it from becoming a bottleneck for Discord API updates.

**Client Exposure**: Modules receive the Discord client instance directly in command and event execute functions. This exposure enables modules to access the full Discord API—not just the immediate interaction context. Modules can query guilds, channels, users, or any other Discord entity. The framework trusts modules with full client access.

## State Management Philosophy

State management represents one of the most critical conceptual areas in Quetza, as improper state handling leads to the majority of module bugs.

**Ephemeral by Default**: All state in Quetza is ephemeral—it exists in memory and is lost on restart. This default pushes developers to consider whether state truly needs persistence. For many features (like current audio playback state), ephemeral state is appropriate. For others (like user preferences), external persistence is required.

**Scope as Key**: State should be keyed by its natural scope. Guild-specific state keys by guild ID. User-specific state keys by user ID, often nested within guild ID. Channel-specific state keys by channel ID. This scoping prevents state leakage and ensures resources don't interfere across boundaries.

**Lifecycle Ownership**: Controllers own resource lifecycles. They decide when to create resources, when to destroy them, and how to handle concurrent access. Commands don't create or destroy resources directly—they request them from controllers. This centralization prevents resource leaks and race conditions.

**Immutability Where Possible**: While JavaScript doesn't enforce immutability, the conceptual model favors it. Rather than mutating shared state directly, prefer creating new state and replacing the old. This approach reduces bugs from unexpected mutations and simplifies reasoning about state changes over time.

## Error Handling Mental Model

Errors in distributed systems like Discord bots require specific handling strategies to maintain reliability.

**Fail Fast Principle**: Modules should validate inputs and preconditions early, failing immediately with clear errors. Don't attempt to continue execution with invalid state—stop, report the error, and let the user correct the issue. This principle prevents cascading failures and makes debugging easier.

**User-Facing Errors**: Errors should be translated to user-friendly messages. Users don't care about stack traces or internal error codes; they need to know what went wrong and how to fix it. Modules should catch technical errors and present them in accessible language.

**Isolation of Failures**: An error in one command shouldn't crash the bot or affect other commands. Each command execution is isolated—exceptions are caught and handled within that execution context. This isolation ensures that bugs in one feature don't compromise the entire bot.

**Logging for Operators**: While user-facing errors should be friendly, operator logs should be detailed. Log errors with full context—what command was executing, what state existed, what went wrong. These logs enable debugging production issues where direct observation isn't possible.

Understanding Quetza's concepts—its philosophical foundations, core entities, vocabulary, patterns, API relationships, state management, and error handling—provides the mental framework necessary for effective module development. These concepts represent the "why" behind the architecture, enabling developers to make aligned decisions even in novel situations.

# Getting Started

## What is Quetza?

Quetza is a modular Discord bot framework that enables developers to build feature-rich Discord applications through self-contained, composable modules. Rather than providing a monolithic bot with fixed capabilities, Quetza offers an architectural foundation that transforms feature development from core modification into module addition. The project addresses the fundamental challenge of extensible bot design: how to add functionality without increasing system complexity or coupling.

## The Core Problem

Discord bots traditionally suffer from architectural rigidity. Adding a new feature requires modifying the bot's core logic, intertwining dependencies, and managing an ever-growing codebase. As features accumulate, the system becomes brittle, difficult to test, and resistant to change. Quetza solves this by inverting the dependency structure—the core knows nothing about modules, yet modules have full access to Discord client capabilities through a well-defined contract.

## High-Level Architecture

At its essence, Quetza is a composition of three architectural layers:

**Foundation Layer**: A Discord.js client extended with module-aware collections. This layer maintains three registries: commands, events, and modules. The client acts as a service locator, routing Discord interactions to the appropriate module components while maintaining clean boundaries.

**Module Layer**: Self-contained feature packages that expose commands, events, and an optional controller. Modules follow a convention-based file structure that enables automatic discovery and registration. Each module operates independently, interacting with Discord through the standardized command and event interfaces.

**Service Layer**: Optional controllers that orchestrate module-specific business logic. Controllers implement the service locator pattern, managing stateful resources (like audio players or conversation contexts) across multiple Discord guilds. They bridge the gap between stateless command execution and stateful feature behavior.

## Mental Model for Understanding Quetza

To effectively work with Quetza, adopt the following mental framework:

**Modules as Plugins**: Think of modules as independently loadable plugins, similar to browser extensions or IDE plugins. Each module declares its capabilities (commands and events) and is discovered automatically through filesystem conventions. There is no central registry to update—the act of creating the module folder makes it available.

**Commands as Endpoints**: Commands function like REST API endpoints for Discord interactions. They are stateless handlers that receive an interaction, process it using the controller's services, and respond. Commands don't manage state; they delegate to controllers for any persistent or cross-invocation behavior.

**Events as Observers**: Events implement the observer pattern, subscribing to Discord client lifecycle events. Multiple modules can observe the same event without conflict. Events handle reactive logic—responding to changes in Discord state (user joins voice, message sent, etc.).

**Controllers as Services**: Controllers are service objects that manage module state across guild boundaries. A controller might maintain one audio player per guild, or one conversation history per user per guild. Controllers are instantiated once per module and injected into all command and event executions.

**Guild as Scope Boundary**: Discord guilds (servers) represent the natural isolation boundary for state. Most module functionality is scoped per-guild—an audio player in Guild A is independent of Guild B's player. Controllers enforce this through guild-keyed collections.

## The Value Proposition

Quetza's architecture delivers value through several key principles:

**Zero-Touch Extension**: Adding functionality requires no modification to existing code. Create a module folder with the prescribed structure, and the feature becomes available upon bot restart. This enables parallel development by multiple teams without merge conflicts.

**Compositional Flexibility**: Modules can be enabled or disabled by presence in the filesystem. Need music without AI? Remove the AI module folder. This allows runtime configuration through deployment strategies rather than code changes.

**Separation of Concerns**: Commands handle interaction protocols, controllers manage business logic, and events respond to lifecycle changes. This separation enables independent testing, replacement of components, and clear reasoning about responsibility.

**Scalable Complexity**: As the bot grows, complexity remains localized to modules. The core architecture scales from a simple ping bot to a full-featured platform without increasing cognitive overhead for developers working on individual features.

## Architectural Invariants

To maintain system integrity, Quetza enforces several architectural invariants:

**Convention-Based Discovery**: Modules must follow the prescribed directory structure (module.ts, commands/, events/). Deviation from this convention results in the module being ignored. This trades flexibility for predictability.

**Interface Compliance**: Commands must export a data object (Discord ApplicationCommandData) and an execute function. Events must export a name and execute function. These contracts enable the framework to treat modules uniformly.

**Controller Optionality**: Controllers are optional. Simple modules (like a basic utility command) can operate without state management. Complex modules (like music playback) leverage controllers for resource lifecycle management.

**Single-Phase Initialization**: All modules are loaded during client construction, before Discord connection. This ensures deterministic initialization order and prevents runtime module loading complexity.

## The Development Philosophy

Quetza embodies a philosophy of minimalist abstraction. The framework provides just enough structure to enable modularity without prescribing implementation details. Modules can use any libraries, patterns, or architectures internally—the framework only cares about the command/event interfaces and the controller contract.

The module system is intentionally filesystem-based rather than registry-based. This makes module availability explicit and deployable through standard DevOps practices (Docker layers, git submodules, filesystem mounts). It also eliminates the need for dependency injection frameworks or complex configuration files.

## System Boundaries and Constraints

Understanding what Quetza does not provide is as important as understanding its capabilities:

**No Persistence Layer**: Quetza provides no database abstraction or state persistence. Controllers maintain in-memory state that is lost on restart. Modules requiring persistence must implement their own storage solutions.

**No Inter-Module Communication**: Modules cannot directly invoke other modules' functionality. They operate independently, communicating only through Discord's shared state (messages, channels, roles). This ensures modules remain loosely coupled.

**No Dynamic Loading**: Modules are loaded at startup, not runtime. Adding a module requires a bot restart. This simplifies lifecycle management but reduces operational flexibility.

**No Configuration Management**: While the framework supports environment variables for sensitive data (Discord tokens, API URLs), it provides no configuration file system or feature flags. Module behavior is controlled through code, not configuration.

## The Path Forward

To work effectively with Quetza, developers should internalize the module lifecycle: declaration in module.ts, command registration through filesystem presence, event subscription through exported handlers, and state management through controllers. The framework handles discovery, registration, and routing—developers focus on feature implementation.

Success with Quetza comes from embracing constraints. The rigid module structure creates freedom through consistency. The lack of inter-module communication forces loose coupling. The stateless command model encourages proper service layer design. These constraints guide developers toward maintainable, scalable implementations.

The Quetza architecture scales both up (adding complex features like AI integration) and down (simple utility commands). Understanding the foundational patterns—service locator, observer, plugin architecture—enables developers to leverage the framework's full potential while maintaining the simplicity that makes it approachable.

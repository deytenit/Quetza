# Quetza Documentation

This directory contains comprehensive conceptual documentation for the Quetza Discord bot framework. The documentation is organized into five interconnected pages, each focusing on a distinct aspect of understanding and working with Quetza.

## Documentation Structure

### [Getting Started](./getting-started.md)
**Purpose**: Foundational understanding of Quetza

Defines the project's purpose, the core problem it solves, the high-level architecture, and the mental model required to understand the system. This page establishes the conceptual foundation for all other documentation.

**Key Topics**:
- What Quetza is and the problem it solves
- High-level three-layer architecture (Foundation, Module, Service)
- Mental models: modules as plugins, commands as endpoints, events as observers
- Architectural invariants and development philosophy
- System boundaries and constraints

**Read this first** to understand why Quetza exists and how its architecture enables modular Discord bot development.

---

### [Guides](./guides.md)
**Purpose**: Understanding primary workflows and operational paths

Maps out the standard lifecycle of operations within Quetza, from module development through deployment and lifecycle management. Focuses on the "path to value" without implementation details.

**Key Topics**:
- Module development workflow (conceptualization through integration)
- Deployment and operational workflow (containerized and source-based)
- Module lifecycle management (development iteration, versioning, deprecation)
- Integration patterns (simple commands, stateful services, event-driven, hybrid)
- Operational lifecycle (initialization, steady-state, graceful degradation)

**Read this second** to understand how to work with Quetza across development and production environments.

---

### [Recipes](./recipes.md)
**Purpose**: Strategic patterns for solving common use cases

Describes high-level architectural patterns for combining Quetza's features to address specific business and functional requirements. Emphasizes composition strategies over implementation syntax.

**Key Topics**:
- Building interactive voice features (resource scoping, command orchestration)
- Implementing conversational AI integrations (context management, response streaming)
- Creating reactive moderation systems (event-driven observation, pattern detection)
- Building scheduled and periodic features (initialization hooks, guild-specific scheduling)
- Composing multi-module experiences (shared state, consistent UX)
- Implementing external integrations (credential management, API abstraction)
- Building permission-aware features (RBAC, graceful denial)

**Read this third** when you need to solve specific functional requirements using Quetza's architecture.

---

### [Concepts](./concepts.md)
**Purpose**: Understanding the underlying philosophy and vocabulary

Explains the core entities, their relationships, design patterns, and the conceptual framework that guides Quetza's architecture. Defines the "vocabulary" of the project.

**Key Topics**:
- Underlying philosophy (convention over configuration, composition over inheritance)
- Core entities and relationships (Client, Modules, Commands, Events, Controllers)
- Module system vocabulary (declarations, registration, binding, injection, scoping)
- Architectural patterns (plugin, service locator, observer, template method)
- Relationship between modules and Discord API
- State management philosophy (ephemeral by default, scope as key)
- Error handling mental model (fail fast, user-facing, isolation)

**Read this fourth** to deepen your understanding of why Quetza works the way it does and to internalize its patterns.

---

### [Troubleshooting](./troubleshooting.md)
**Purpose**: Diagnosing system behavior and correcting mental model misalignments

Addresses conceptual pitfalls, logic errors, and architectural misunderstandings. Focuses on diagnostic strategies rather than specific error fixes.

**Key Topics**:
- Module discovery and loading failures (structural conventions, export interfaces)
- Command registration and visibility issues (timing, data malformation, routing)
- State management and controller confusion (instance lifecycle, guild scoping, leaks)
- Event handling mental model errors (multiple handlers, argument interpretation)
- Discord API interaction misunderstandings (permissions, rate limiting, interaction types)
- Environment and configuration issues (missing variables, type mismatches)
- External dependency failures (binary absence, API unavailability)
- Debugging strategies (log-driven diagnosis, isolation, minimal reproduction)

**Read this** when encountering unexpected behavior or when your mental model doesn't align with system behavior.

---

## Reading Recommendations

**For New Users**: Start with Getting Started, then proceed to Guides, and explore Recipes as needed for specific use cases.

**For Developers**: After Getting Started, review Concepts to understand the architectural patterns, then use Guides for workflow understanding and Recipes for implementation patterns.

**For Troubleshooting**: Start with the relevant section in Troubleshooting, but if conceptual confusion persists, revisit Concepts to correct mental model misalignments.

**For Architectural Understanding**: Read Getting Started → Concepts → Guides → Recipes in sequence for a comprehensive architectural perspective.

## Documentation Philosophy

This documentation suite focuses on the **"what" and "why"** rather than the **"how-to-code"**. It provides:

- **Conceptual frameworks** rather than code examples
- **Architectural understanding** rather than API references
- **Mental models** rather than step-by-step instructions
- **Strategic patterns** rather than implementation details

For implementation examples and code references, see the source code in the `/modules` directory and the main [README.md](../README.md).

## Additional Resources

- [Main README](../README.md): Project overview, installation, and quick start
- [Source Code](../src): Core framework implementation
- [Module Examples](../modules): Reference implementations (ai, core, music)
- [Privacy Policy](./privacy-policy.md): Data handling and privacy information

---

**Contributing to Documentation**: When updating this documentation, maintain the focus on concepts and architecture. Avoid code snippets, API tables, and implementation specifics. Each page should remain approximately one conceptual page in length, providing comprehensive understanding without overwhelming detail.

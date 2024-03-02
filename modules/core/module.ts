/**
 * Core Quetza Module definition.
 *
 * This module provides default capabilities.
 * - Comands are being resolved here at InteractionCreated event.
 * - Aplication status being generated as well as commands pushed to Discord at Ready event.
 *
 *  Also this module provides basic commands:
 *  - ping
 *  - modules
 *
 *  There a lot of speaking because it's as important as $lib.
 *
 *  @packageDocumentation
 */

const name = "core";
const description = "Quetza's core functionality";

export { description, name };

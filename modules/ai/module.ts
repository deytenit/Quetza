/**
 * AI module definition.
 *
 * Module to provide AI conversational capabilities using locally deployed Llama LLM.
 * Supports slash commands and reply-based interactions with conversation persistence.
 *
 * @packageDocumentation
 */

import AI from "./lib/ai.js";

const name = "ai";
const description = "AI conversational module with Llama LLM integration";

const controller = new AI();

export { controller, description, name };

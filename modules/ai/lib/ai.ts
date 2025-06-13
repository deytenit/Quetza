import { Collection } from "discord.js";

import { Conversation } from "./conversation.js";
import { LlamaClient } from "./llama.js";

/**
 * AI module controller.
 *
 * Manages conversations and Llama LLM interactions.
 */
export default class AI {
    /**
     * Llama API client.
     */
    public readonly llama = new LlamaClient();

    /**
     * Guild + User ID to Conversation mapping.
     */
    private conversations_ = new Collection<string, Conversation>();

    /**
     * Gets or creates a conversation for a user in a guild.
     *
     * @param guildId - Discord guild ID
     * @param userId - Discord user ID
     * @returns Conversation instance
     */
    public getConversation(guildId: string, userId: string): Conversation {
        const key = `${guildId}:${userId}`;

        if (!this.conversations_.has(key)) {
            this.conversations_.set(key, new Conversation(guildId, userId));
        }

        return this.conversations_.get(key)!;
    }

    /**
     * Clears conversation history for a user in a guild.
     *
     * @param guildId - Discord guild ID
     * @param userId - Discord user ID
     */
    public clearConversation(guildId: string, userId: string): void {
        const key = `${guildId}:${userId}`;
        this.conversations_.delete(key);
    }
}

import { LlamaMessage } from "./llama.js";

/**
 * Manages conversation history for a specific user in a guild.
 */
export class Conversation {
    public readonly guildId: string;
    public readonly userId: string;
    public readonly messages: LlamaMessage[] = [];
    public readonly createdAt: Date = new Date();
    public lastActivity: Date = new Date();

    private readonly maxMessages = 50; // Limit conversation history

    public constructor(guildId: string, userId: string) {
        this.guildId = guildId;
        this.userId = userId;
    }

    /**
     * Adds a user message to the conversation.
     *
     * @param content - User's message content
     */
    public addUserMessage(content: string): void {
        this.messages.push({ role: "user", content });
        this.lastActivity = new Date();
        this.trimHistory();
    }

    /**
     * Adds an assistant response to the conversation.
     *
     * @param content - Assistant's response content
     */
    public addAssistantMessage(content: string): void {
        this.messages.push({ role: "assistant", content });
        this.lastActivity = new Date();
        this.trimHistory();
    }

    /**
     * Gets the conversation history.
     *
     * @returns Array of messages
     */
    public getHistory(): LlamaMessage[] {
        return [...this.messages];
    }

    /**
     * Clears the conversation history.
     */
    public clear(): void {
        this.messages.length = 0;
        this.lastActivity = new Date();
    }

    /**
     * Trims conversation history to stay within limits.
     */
    private trimHistory(): void {
        if (this.messages.length > this.maxMessages) {
            this.messages.splice(0, this.messages.length - this.maxMessages);
        }
    }

    /**
     * Checks if the conversation is stale (inactive for over 1 hour).
     *
     * @returns True if conversation should be considered stale
     */
    public isStale(): boolean {
        const oneHour = 60 * 60 * 1000;
        return Date.now() - this.lastActivity.getTime() > oneHour;
    }
}

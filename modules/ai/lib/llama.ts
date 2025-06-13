import logger from "$lib/logger.js";
import config from "$config.js";

export interface LlamaResponse {
    content: string;
    done: boolean;
}

export interface LlamaMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

/**
 * Client for communicating with locally deployed Llama LLM.
 */
export class LlamaClient {
    private readonly baseUrl = config.llama.apiUrl || "http://localhost:11434";
    private readonly model = config.llama.model || "llama3.2";

    /**
     * Sends a chat completion request to Llama.
     *
     * @param messages - Array of conversation messages
     * @returns Promise resolving to Llama response
     */
    public async chat(messages: LlamaMessage[]): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Llama API error: ${response.status} ${response.statusText}`);
            }

            const data = (await response.json()) as { message: { content: string } };
            return data.message.content;
        } catch (error) {
            logger.error("Failed to communicate with Llama API", { error });
            throw new Error("Unable to process your request. Please try again later.");
        }
    }

    /**
     * Tests connection to Llama API.
     *
     * @returns Promise resolving to true if connection is successful
     */
    public async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

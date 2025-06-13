/**
 * /ask
 *
 * Sends a prompt to the locally deployed Llama LLM and returns the response.
 * Maintains conversation history per user and guild.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";

import AI from "../lib/ai.js";
import replies from "../lib/replies.js";

async function execute(
    _: Client,
    interaction: ChatInputCommandInteraction,
    controller: AI
): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        logger.warn("Interaction rejected.", { interaction });
        return;
    }

    const prompt = interaction.options.getString("prompt", true);

    await interaction.deferReply();

    try {
        // Test Llama connection
        const isConnected = await controller.llama.testConnection();
        if (!isConnected) {
            await interaction.editReply(replies.connectionError());
            return;
        }

        // Get or create conversation
        const conversation = controller.getConversation(interaction.guildId, interaction.user.id);

        // Clear stale conversations
        if (conversation.isStale()) {
            conversation.clear();
        }

        // Add user message to conversation
        conversation.addUserMessage(prompt);

        // Send to Llama
        const response = await controller.llama.chat(conversation.getHistory());

        // Add assistant response to conversation
        conversation.addAssistantMessage(response);

        // Reply with the response
        await interaction.editReply(replies.response(response));
    } catch (error) {
        logger.error("Error in ask command", {
            error,
            userId: interaction.user.id,
            guildId: interaction.guildId
        });
        await interaction.editReply(replies.error());
    }
}

const data = new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the AI assistant")
    .addStringOption((option) =>
        option
            .setName("prompt")
            .setDescription("Your question or prompt")
            .setRequired(true)
            .setMaxLength(2000)
    )
    .setDMPermission(false);

export { data, execute };

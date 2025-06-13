/**
 * /askclear
 *
 * Clears the conversation history for the current user in the current guild.
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

    controller.clearConversation(interaction.guildId, interaction.user.id);

    await interaction.reply(replies.historyCleared());
}

const data = new SlashCommandBuilder()
    .setName("askclear")
    .setDescription("Clear your conversation history with the AI assistant")
    .setDMPermission(false);

export { data, execute };

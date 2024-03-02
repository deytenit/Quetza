/**
 * /info
 *
 * Replies with very stylish player info card.
 *
 * Playback status bar with title, thumbnail and duration.
 * Queue length and duration.
 * Applied filters.
 * Current loop option.
 * Player lifetime.
 *
 * Possible replies:
 * - Success with info card.
 * - Player does not exists.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";
import Music from "$mlib/music.js";

import replies from "../lib/replies.js";

async function execute(
    _: Client,
    interaction: ChatInputCommandInteraction,
    controller: Music
): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild() || !interaction.channel) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    await interaction.reply(replies.info(player));
}

const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Verbose information about player and stats.")
    .setDMPermission(false);

export { data, execute };

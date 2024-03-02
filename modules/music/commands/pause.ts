/**
 * /pause
 *
 * Toggles playback pause.
 *
 * Possible replies:
 * - Success with setted state (paused, resumed).
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

    const state = player.pause();

    await interaction.reply(replies.paused(state));
}

const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Toggle pause on playback.")
    .setDMPermission(false);

export { data, execute };

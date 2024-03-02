/**
 * /stop
 *
 * Destroys player of the Guild where it was emitted.
 * Also disconnects user from Voice Channel Quetza was in.
 *
 * Possible replies:
 * - Success with player being destroyed.
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

    player.destroy();

    await interaction.reply(replies.destroyed());
}

const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Destroy the player.")
    .setDMPermission(false);

export { data, execute };

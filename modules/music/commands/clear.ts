/**
 * /clear
 *
 * Clears Player queue entirely.
 *
 * Possible replies:
 * - Success with amount of tracks deleted.
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

    const amount = player.queue.tracks.length;

    player.clear();

    await interaction.reply(replies.cleared(amount));
}

const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the player's queue.")
    .setDMPermission(false);

export { data, execute };

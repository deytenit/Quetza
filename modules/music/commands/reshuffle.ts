/**
 * /reshuffle
 * Shuffles the queue, so real order is changed.
 * DO NOT Confuse it with AUTO LoopOption.
 *
 * Possible replies:
 * - Success with queue being reshuffled.
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

    player.shuffle();

    await interaction.reply(replies.reshuffle());
}

const data = new SlashCommandBuilder()
    .setName("reshuffle")
    .setDescription("Reshuffle the queue. (Will change queue order)")
    .setDMPermission(false);

export { data, execute };

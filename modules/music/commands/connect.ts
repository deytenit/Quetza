/**
 * /connect
 *
 * Connects bot to the voice channel.
 *
 * Just like play but without query.
 *
 * Possible replies:
 * - Success with Voice Channel bot connected to.
 * - Requester does not connected to the Voice Channel.
 *
 * @deprecated Does not make sense.
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

    await interaction.deferReply();

    const player =
        controller.get(interaction.guild, interaction.channel) ??
        controller.set(interaction.guild, interaction.channel);

    const channel = interaction.member.voice.channel;

    if (!channel) {
        controller.delete(interaction.guildId);

        await interaction.editReply(replies.notConnected());

        return;
    }

    player.connect(channel);

    await interaction.editReply(replies.okConnected(channel.name));

    return;
}

const data = new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connect me explicitly to the voice channel.")
    .setDMPermission(false);

export { data, execute };

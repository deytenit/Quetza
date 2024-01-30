import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";

import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
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

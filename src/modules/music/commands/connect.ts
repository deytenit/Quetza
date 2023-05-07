import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import Player from "../lib/player.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction): Promise<Player | undefined> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    await interaction.deferReply();

    const player =
        controller.get(interaction.guild.id, interaction.channel as TextChannel) ??
        controller.set(interaction.guild, interaction.channel as TextChannel);

    if (player.connection) {
        await interaction.editReply(replies.isConnected());

        return player;
    }

    const channel = interaction.member.voice.channel;

    if (!channel) {
        controller.delete(interaction.guild.id);

        await interaction.editReply(replies.notConnected());

        return;
    }

    player.connect(channel);

    await interaction.editReply(replies.okConnected(channel.name));

    return player;
}

const data = new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connect me explicitly to the voice channel.")
    .setDMPermission(false);

export { data, execute };

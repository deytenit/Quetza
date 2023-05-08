import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const query = interaction.options.getString("query");

    await interaction.reply(replies.searching());

    const player =
        controller.get(interaction.guild.id, interaction.channel as TextChannel) ??
        controller.set(interaction.guild, interaction.channel as TextChannel);

    const channel = interaction.member.voice.channel;

    if (!channel) {
        controller.delete(interaction.guild.id);

        await interaction.editReply(replies.notConnected());

        return;
    }

    player.connect(channel);

    if (query) {
        const track = await player.add(query, interaction.user);

        await interaction.editReply(replies.appended(track));
    }

    if (!player.resource) {
        player.play();
    }
}

const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Launch player and add songs to the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Title or URL of the song.")
    )
    .setDMPermission(false);

export { data, execute };

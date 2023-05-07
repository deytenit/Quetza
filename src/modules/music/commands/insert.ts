import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const pos = interaction.options.getNumber("position", true);
    const query = interaction.options.getString("query", true);

    await interaction.deferReply();

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        await interaction.editReply(replies.notExists());

        return;
    }

    const track = await player.add(query, interaction.user, pos - 1);

    await interaction.editReply(replies.appended(track));
}

const data = new SlashCommandBuilder()
    .setName("insert")
    .setDescription("Insert a new track to specific position in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Title or URL of the song.").setRequired(true)
    )
    .addIntegerOption((option) =>
        option.setName("position").setDescription("Position to insert.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

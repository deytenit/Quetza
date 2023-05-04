import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const pos = interaction.options.get("position")?.value as number;
    const query = interaction.options.get("query")?.value as string;

    if (!interaction.guild || !query || !pos || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    await interaction.deferReply();

    const track = await player.add(query, interaction.user, pos - 1);

    await interaction.editReply({ embeds: [I18n.embeds.appended(track)] });
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

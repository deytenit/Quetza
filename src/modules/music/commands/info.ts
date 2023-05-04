import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.channel || !interaction.member) {
        return;
    }

    await interaction.deferReply();

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    await interaction.editReply({ embeds: [I18n.embeds.playerInfo(player)] });
}

const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Information about the playback.")
    .setDMPermission(false);

export { data, execute };

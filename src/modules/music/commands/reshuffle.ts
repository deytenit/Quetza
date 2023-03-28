import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    player.shuffle();

    await interaction.reply({ embeds: [I18n.embeds.reshuffle()] });
}

const data = new SlashCommandBuilder().setName("reshuffle").setDescription("Shuffle the queue.");

export { data, execute };

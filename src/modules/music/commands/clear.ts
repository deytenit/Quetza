import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) return;

    const amount = player.Queue.Tracks.length;

    player.clear();

    await interaction.reply({ embeds: [I18n.en.cleared(amount)] });
}

const data = new SlashCommandBuilder().setName("clear").setDescription("Clear the player's queue.");

export { data, execute };

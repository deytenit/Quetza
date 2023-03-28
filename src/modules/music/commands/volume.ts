import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const volume = (interaction.options.get("volume")?.value as number) || 100;

    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    player.volume = volume;

    await interaction.reply({ embeds: [I18n.embeds.volumeSet(player.volume)] });
}

const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change player's volume amount.")
    .addIntegerOption((option) =>
        option.setName("volume").setDescription("Volume in percents.").setRequired(true)
    );

export { data, execute };

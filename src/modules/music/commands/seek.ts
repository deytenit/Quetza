import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const hours = (interaction.options.get("hrs")?.value as number) || 0;
    const minutes = (interaction.options.get("mins")?.value as number) || 0;
    const seconds = (interaction.options.get("secs")?.value as number) || 0;

    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    const time = hours * 3600 + minutes * 60 + seconds;

    player.seek(time * 1000);

    await interaction.reply({
        embeds: [I18n.embeds.fastForwarded(time)]
    });
}

const data = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Fast-forward by the time.")
    .addIntegerOption((option) => option.setName("hrs").setDescription("Hours to seek."))
    .addIntegerOption((option) => option.setName("mins").setDescription("Minutes to seek."))
    .addIntegerOption((option) => option.setName("secs").setDescription("Seconds to seek."));

export { data, execute };

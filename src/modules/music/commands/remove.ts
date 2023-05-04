import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get("query")?.value as string;

    if (!interaction.guild || !query || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    const track =
        !isNaN(+query) && isFinite(+query) && !/e/i.test(query)
            ? player.remove(parseInt(query) - 1)
            : player.remove(query);

    await interaction.reply({ embeds: [I18n.embeds.removed(track)] });
}

const data = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove specific track in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Position or title to remove.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

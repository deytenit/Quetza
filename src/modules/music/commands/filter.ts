import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import config from "../config.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const filter = interaction.options.getString("filter") ?? undefined;
    const name = interaction.options.get("filter")?.name;

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    const status = player.setFilter(filter);

    await interaction.reply(replies.filtered(name, status));
}

const data = new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Apply unique filters to the playback.")
    .addStringOption((option) =>
        option
            .setName("filter")
            .setDescription("Filter to apply.")
            .setChoices(...config.playerFilterChoices)
            .setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

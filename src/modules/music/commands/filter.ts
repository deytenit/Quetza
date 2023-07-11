import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";
import Filter from "../lib/filter.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild() || !interaction.channel) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const filter = interaction.options.getString("filter") ?? undefined;

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    const status = player.setFilter(filter);

    await interaction.reply(replies.filtered(filter, status));
}

const data = new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Apply unique filters to the playback.")
    .addStringOption((option) =>
        option
            .setName("filter")
            .setDescription("Filter to apply.")
            .setChoices(
                ...Object.keys(Filter.filters).map((key) => {
                    return { name: key, value: key };
                })
            )
    )
    .setDMPermission(false);

export { data, execute };

/**
 * /filter <filter id>
 *
 * Toggles filter that will be applied to the playback.
 * Such as nightcore, etc.
 *
 * If no filter id was provided clears them all.
 *
 * Possible replies:
 * - Success with chosen filter status or filters being cleared.
 * - Player does not exists.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";
import Music from "$mlib/music.js";

import Filter from "../lib/filter.js";
import replies from "../lib/replies.js";

async function execute(
    _: Client,
    interaction: ChatInputCommandInteraction,
    controller: Music
): Promise<void> {
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
            .setChoices(...Filter.filterChoices())
    )
    .setDMPermission(false);

export { data, execute };

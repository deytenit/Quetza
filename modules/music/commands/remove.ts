/**
 * /remove (query)
 *
 * Removes Track from the queue.
 * If number was provided - resolves as position at where deletion should occurr.
 * If string was provided - removes most similar if terms of {@link ../lib/misc#LargestCommonSequence} Track title.
 *
 * Possible replies:
 * - Success with removed track data.
 * - Such track does not exists, though cannot be removed.
 * - Player does not exists.
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";
import Music from "$mlib/music.js";

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

    const query = interaction.options.getString("query", true);

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    const track =
        !isNaN(+query) && isFinite(+query) && !/e/i.test(query)
            ? player.remove(parseInt(query) - 1)
            : player.remove(query);

    await interaction.reply(replies.removed(track));
}

const data = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove specific track in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Position or title to remove.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

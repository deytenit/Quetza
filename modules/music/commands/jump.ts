/**
 * /jump (query)
 *
 * Jumps to the specified Track from the queue.
 * If number was provided - resolves as position at where queue position should be set.
 * If string was provided - jumps to the most similar if terms of {@link ../lib/misc#LargestCommonSequence} Track title.
 *
 * Possible replies:
 * - Success with selected track data.
 * - Such track does not exists, though cannot be jumped to.
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

    const previous = player.resource?.metadata;

    const position =
        !isNaN(+query) && isFinite(+query) && !/e/i.test(query)
            ? player.jump(parseInt(query) - 1)
            : player.jump(query);

    await interaction.reply(replies.jumped(previous, position));
}

const data = new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to specific track in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Position or title to jump to.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

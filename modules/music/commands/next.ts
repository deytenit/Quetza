/**
 * /next
 *
 * Skips current track.
 *
 * Possible replies:
 * - Success with confirmation of skip. (even there is nothing to skip)
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

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    player.skip();

    await interaction.reply(replies.skipped());
}

const data = new SlashCommandBuilder()
    .setName("next")
    .setDescription("Skip current song.")
    .setDMPermission(false);

export { data, execute };

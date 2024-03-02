/**
 * /volume (amount)
 *
 * Sets volume of {@link ../lib/player#Player | Player} in percent scale,
 * clamping it in range defined in Player.
 *
 * Possible replies:
 * - Success with new volume value.
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

    const volume = interaction.options.getInteger("volume", true);

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    player.volume = volume;

    await interaction.reply(replies.volumeSet(player.volume));
}

const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change player's volume amount.")
    .addIntegerOption((option) =>
        option.setName("volume").setDescription("Volume in percents.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

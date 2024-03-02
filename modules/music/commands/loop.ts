/**
 * /loop (option)
 *
 * Changes loop option.
 *
 * @remarks
 * @see {@link ../lib/types} for LoopOption definition.
 *
 * Possible replies:
 * - Success with new loop option.
 * - Player does not exists.
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";
import Music from "$mlib/music.js";

import replies from "../lib/replies.js";
import { LoopOption } from "../lib/types.js";

async function execute(
    _: Client,
    interaction: ChatInputCommandInteraction,
    controller: Music
): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild() || !interaction.channel) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const option = interaction.options.getString("option", true) as LoopOption;

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    player.queue.loop = option;

    await interaction.reply(replies.looped(option));
}

const data = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Select player's loop mode.")
    .addStringOption((option) =>
        option
            .setName("option")
            .setDescription("Loop option.")
            .setChoices(
                { name: "Loop queue", value: "LOOP" },
                { name: "Loop single track", value: "SONG" },
                { name: "Drop on final", value: "NONE" },
                { name: "Random", value: "AUTO" }
            )
            .setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

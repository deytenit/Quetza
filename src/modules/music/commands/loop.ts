import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { LoopOption } from "../lib/types.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const option = interaction.options.getString("option", true) as LoopOption;

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

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

import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const query = interaction.options.getString("query", true);

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    const prevPosition = player.queue.position;

    const nextPosition =
        !isNaN(+query) && isFinite(+query) && !/e/i.test(query)
            ? player.jump(parseInt(query) - 1)
            : player.jump(query);

    await interaction.reply(replies.jumped(prevPosition, nextPosition));
}

const data = new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to specific track in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Position or title to jump to.").setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

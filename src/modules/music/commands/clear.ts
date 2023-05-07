import { Interaction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    const amount = player.queue.tracks.length;

    player.clear();

    await interaction.reply(replies.cleared(amount));
}

const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the player's queue.")
    .setDMPermission(false);

export { data, execute };

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";

import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction) {
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

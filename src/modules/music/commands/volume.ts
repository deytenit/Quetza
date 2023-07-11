import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild() || !interaction.channel) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const volume = interaction.options.getInteger("volume") ?? 100;

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

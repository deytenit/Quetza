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

    const hours = interaction.options.getInteger("hrs") ?? 0;
    const minutes = interaction.options.getInteger("mins") ?? 0;
    const seconds = interaction.options.getInteger("secs") ?? 0;

    const player = controller.get(interaction.guild, interaction.channel);

    if (!player) {
        await interaction.reply(replies.notExists());

        return;
    }

    if (!player.resource) {
        await interaction.reply(replies.notPlaying());

        return;
    }

    const prevTime = player.resource.playbackDuration / 1000;

    const nextTime = hours * 3600 + minutes * 60 + seconds;

    player.seek(nextTime * 1000);

    await interaction.reply(replies.seeked(prevTime, nextTime));
}

const data = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Fast-forward/Fast-reverse by the given time.")
    .addIntegerOption((option) => option.setName("hrs").setDescription("Hours to seek."))
    .addIntegerOption((option) => option.setName("mins").setDescription("Minutes to seek."))
    .addIntegerOption((option) => option.setName("secs").setDescription("Seconds to seek."))
    .setDMPermission(false);

export { data, execute };

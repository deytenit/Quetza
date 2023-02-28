import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = controller.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    player.shuffle();

    await ctx.reply({ embeds: [I18n.en.reshuffle()] });
}

const data = new SlashCommandBuilder().setName("reshuffle").setDescription("Shuffle the queue.");

export { data, execute };

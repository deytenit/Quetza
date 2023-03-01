import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) {
        return;
    }

    const player = controller.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    const state = player.pause();

    await ctx.reply({ embeds: [I18n.embeds.paused(state)] });
}

const data = new SlashCommandBuilder().setName("pause").setDescription("Toggle pause on player.");

export { data, execute };

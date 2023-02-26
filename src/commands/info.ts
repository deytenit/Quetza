import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../lib/client.js";
import I18n from "../lib/i18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel || !ctx.member) return;

    await ctx.deferReply();

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    await ctx.editReply({ embeds: [I18n.en.playerInfo(player)] });
}

const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Information about the playback.");

export { data };

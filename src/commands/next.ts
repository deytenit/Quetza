import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Client from "../lib/Client";
import I18n from "../lib/I18n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.skip();

    await ctx.reply({ embeds: [I18n.en.skipped()] });
}

const data = new SlashCommandBuilder()
    .setName("next")
    .setDescription("Skip current song.");

export { data };

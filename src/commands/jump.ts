import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Client from "../lib/Client";
import I18n from "../lib/I18n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.get("query")?.value as string;

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const state = !isNaN(+query) && isFinite(+query) && !/e/i.test(query) ? player.jump(parseInt(query) - 1) : player.jump(query);

    await ctx.reply({ embeds: [I18n.en.jumped(state)] });
}

const data = new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to specific track in the queue.")
    .addStringOption(option => option
        .setName("query")
        .setDescription("Position or title to jump to.")
        .setRequired(true)
    );

export { data };

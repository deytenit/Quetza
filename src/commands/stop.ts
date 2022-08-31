import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Client from "../lib/Client";
import I18n from "../lib/I18n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.destroy();

    await ctx.reply({ embeds: [I18n.en.destroyed()] });
}

const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Destroy the player.");

export { data };

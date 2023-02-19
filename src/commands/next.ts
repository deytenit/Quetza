import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import Client from "../lib/Client.js";
import I18n from "../lib/I18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    player.skip();

    await ctx.reply({ embeds: [I18n.en.skipped()] });
}

const data = new SlashCommandBuilder()
    .setName("next")
    .setDescription("Skip current song.");

export { data };

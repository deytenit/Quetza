import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Client from "../lib/Client";
import I18n from "../lib/I18n";

export async function run(client: Client, ctx: CommandInteraction) {
    const volume = ctx.options.get("volume")?.value as number || 100;

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.Volume = volume;

    await ctx.reply({ embeds: [I18n.en.volumeSet(player.Volume)] });
}

const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change player's volume amount.")
    .addIntegerOption(option => option
        .setName("volume")
        .setDescription("Volume in percents.")
        .setRequired(true)
    );

export { data };

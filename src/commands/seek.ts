import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import Client from "../lib/Client.js";
import I18n from "../lib/I18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    const hours = ctx.options.get("hrs")?.value as number || 0;
    const minutes = ctx.options.get("mins")?.value as number || 0;
    const seconds = ctx.options.get("secs")?.value as number || 0;

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    const time = hours * 3600 + minutes * 60 + seconds;

    player.seek(time * 1000);

    await ctx.reply({
        embeds: [I18n.en.fastForwarded(time)],
    });
}

const data = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Fast-forward by the time.")
    .addIntegerOption(option => option
        .setName("hrs")
        .setDescription("Hours to seek.")
    )
    .addIntegerOption(option => option
        .setName("mins")
        .setDescription("Minutes to seek.")
    )
    .addIntegerOption(option => option
        .setName("secs")
        .setDescription("Seconds to seek.")
    );

export { data };

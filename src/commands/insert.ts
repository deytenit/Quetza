import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import Client from "../lib/Client.js";
import I18n from "../lib/I18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    const pos = ctx.options.get("position")?.value as number;
    const query = ctx.options.get("query")?.value as string;

    if (!ctx.guild || !query || !pos || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    await ctx.deferReply();

    const track = await player.add(query, ctx.user, pos - 1);

    await ctx.editReply({ embeds: [I18n.en.appended(track)] });
}

const data = new SlashCommandBuilder()
    .setName("insert")
    .setDescription("Insert a new track to specific position in the queue.")
    .addStringOption(option => option
        .setName("query")
        .setDescription("Title or URL of the song.")
        .setRequired(true)
    )
    .addIntegerOption(option => option
        .setName("position")
        .setDescription("Position to insert.",)
        .setRequired(true)
    );

export { data };

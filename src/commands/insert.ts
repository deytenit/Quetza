import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const pos = ctx.options.getInteger("position");
    const query = ctx.options.getString("query");

    if (!ctx.guild || !query || !pos || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    await ctx.deferReply();

    const track = await player.add(query, ctx.user, pos - 1);

    await ctx.editReply({ embeds: [I8n.en.appended(track)] });
}

const data = {
    name: "insert",
    description: "Insert new track to specific position.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING",
            required: true,
        },
        {
            name: "position",
            description: "Position to insert.",
            type: "INTEGER",
            required: true,
        },
    ],
};

export { data };

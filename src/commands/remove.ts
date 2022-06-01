import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.getString("query");

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const track = !isNaN(+query) && isFinite(+query) && !/e/i.test(query) ? player.remove(parseInt(query) - 1) : player.remove(query);

    await ctx.reply({ embeds: [I8n.en.removed(track)] });
}

const data = {
    name: "remove",
    description: "Remove specific track in the queue.",
    options: [
        {
            name: "query",
            description: "Position or title to remove.",
            type: "STRING",
            required: true,
        },
    ],
};

export { data };

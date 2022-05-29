import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.getInteger("position");

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const track = player.remove(query - 1);

    await ctx.reply({ embeds: [I8n.en.removed(track)] });
}

const data = {
    name: "remove",
    description: "Remove specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to remove.",
            type: "INTEGER",
            required: true,
        },
    ],
};

export { data };

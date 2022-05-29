import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.getInteger("position");

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const state = player.jump(query - 1);

    await ctx.reply({ embeds: [I8n.en.jumped(state)] });
}

const data = {
    name: "jump",
    description: "Jump to specific track in the queue.",
    options: [
        {
            name: "position",
            description: "Position to jump to.",
            type: "INTEGER",
            required: true,
        },
    ],
};

export { data };

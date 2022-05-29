import Client from "../lib/Client";

import { CommandInteraction } from "discord.js";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.clear();

    await ctx.reply({ embeds: [I8n.en.cleared(player.Queue.Tracks.length)] });
}

const data = {
    name: "clear",
    description: "Clears queue.",
};

export { data };

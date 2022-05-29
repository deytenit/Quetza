import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const state = player.pause();

    await ctx.reply({ embeds: [I8n.en.paused(state)] });
}

const data = {
    name: "pause",
    description: "Toggle pause.",
};

export { data };

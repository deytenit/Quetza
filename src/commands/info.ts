import Client from "../lib/Client";

import { CommandInteraction } from "discord.js";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel || !ctx.member) return;

    await ctx.deferReply();

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    await ctx.editReply({ embeds: [I8n.en.playerInfo(player)] });
}

const data = {
    name: "info",
    description: "Information about the server's music player.",
};

export { data };

import Client from "../lib/Client";

import { CommandInteraction, GuildMember } from "discord.js";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel || !ctx.member) return;

    await ctx.deferReply();

    const player =
        client.modules.music.get(ctx.guild.id, ctx.channel) ||
        client.modules.music.set(ctx.guild, ctx.channel);

    if (!player.Connection) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            player.connect(channel);

            await ctx.editReply({ embeds: [I8n.en.okConnected(channel.name)] });
        } else {
            client.modules.music.del(ctx.guild.id);

            await ctx.editReply({ embeds: [I8n.en.notConnected()] });
            return undefined;
        }
    } else {
        await ctx.editReply({ embeds: [I8n.en.wasConnected()] });
    }

    return player;
}

const data = {
    name: "connect",
    description: "Connect to voice channel.",
};

export { data };

import Client from "../lib/Client.js";

import { CommandInteraction, GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import I18n from "../lib/I18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel || !ctx.member) return;

    await ctx.deferReply();

    const player =
        client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel) ||
        client.modules.music.set(ctx.guild, ctx.channel as TextChannel);

    if (!player.Connection) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            player.connect(channel);

            await ctx.editReply({ embeds: [I18n.en.okConnected(channel.name)] });
        }
        else {
            client.modules.music.del(ctx.guild.id);

            await ctx.editReply({ embeds: [I18n.en.notConnected()] });
            return undefined;
        }
    }
    else {
        await ctx.editReply({ embeds: [I18n.en.wasConnected()] });
    }

    return player;
}

const data = new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connect me to a voice channel.");

export { data };

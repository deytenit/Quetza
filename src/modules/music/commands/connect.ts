import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";

import {
    ColorResolvable, CommandInteraction, GuildMember,
    MessageEmbed, TextChannel
} from "discord.js";



export async function run(client: QuetzaClient, ctx: CommandInteraction, reply = true) {
    if (ctx.guild === null)
        return;

    if (reply)
        await ctx.deferReply();

    const player = client.Modules["music"].control.genPlayer(ctx.guild, client.Modules["music"].control, ctx.channel as TextChannel);

    let embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle("Mistake in connection.")

    if (!player.Connection) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            await player.connect(channel);

            embed.setTitle(`Successfully connected to ${channel.name}.`)
        }
        else {
            client.Modules["music"].control.delPlayer(ctx.guild.id);

            embed.setTitle("Please connect to a voice channel.")
        }
    }
    else {
        embed.setTitle("Already connected to ${channel.name}..")
    }

    if (reply)
        await ctx.editReply({ embeds: [embed] });
    else
        return player;
}

const data = {
    name: "connect",
    description: "Connect to voice channel."
}

export { data }
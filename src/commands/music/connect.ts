import { design } from "../../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { MyClient } from "../../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction, reply = true) {
    if (ctx.guild === null)
        return;

    if (reply)
        await ctx.deferReply();

    const player = client.players.genPlayer(ctx.guild, client.players, ctx.channel as TextChannel);

    let embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Mistake in connection.")

    if (!player.connection) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            await player.connect(channel);

            embed.setTitle(`Successfully connected to ${channel.name}.`)
        }
        else {
            client.players.delPlayer(ctx.guild.id);

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
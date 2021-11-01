import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";
import { VoiceConnectionStatus } from "@discordjs/voice";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guildId === null)
        return;


    let player = client.players.getPlayer(ctx.guildId);

    if (!player)
        player = client.players.genPlayer(ctx.guildId);

    if (!player.connection || player.connection.state.status === VoiceConnectionStatus.Disconnected) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            await player.connect(channel);

            const embed = new MessageEmbed()
                .setColor(design.color as ColorResolvable)
                .setTitle(`Successfully connected to ${channel.name}.`)

            try {
                await ctx.reply({ embeds: [embed] });
            } catch { }
        }
        else {
            client.players.delPlayer(ctx.guildId);

            const embed = new MessageEmbed()
                .setColor(design.color as ColorResolvable)
                .setTitle("Please connect to a voice channel.")

            try {
                await ctx.reply({ embeds: [embed] });
            } catch { }
        }
    }
    else {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Already connected.")

        try {
            await ctx.reply({ embeds: [embed] });
        } catch { }
    }
}

const data = {
    name: "connect",
    description: "Connect to voice channel."
}

export { data }
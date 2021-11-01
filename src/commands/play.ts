import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, Message, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";
import { VoiceConnectionStatus } from "@discordjs/voice";
import { run as connect } from "./connect";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("query");

    if (ctx.guildId === null || query === null)
        return;
     
    connect(client, ctx);

    const player = client.players.genPlayer(ctx.guildId);

    const track = await player.addTrack(query, ctx.user);

    if (!player.nowPlaying) {
        await player.play();
    }
    const embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle(track.title)
        .setDescription("Has been pushed to queue.")
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setAuthor(`@${ctx.user.tag}`, ctx.user.avatarURL() as string);

    if (ctx.channel)
        player.setMessage(await ctx.channel.send({ embeds: [embed] }));

    console.log(`${track.title} added to ${ctx.guildId}`);
}

const data = {
    name: "play",
    description: "Play a song or add it to queue.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("query");

    if (ctx.guildId === null || query === null)
        return;


    let player = client.players.getPlayer(ctx.guildId);

    if (!player)
        player = client.players.genPlayer(ctx.guildId);

    if (!player.connection) {
        const channel = (ctx.member as GuildMember).voice.channel;
        if (channel) {
            await player.connect(channel);
        } 
        else {
            client.players.delPlayer(ctx.guildId);
            await ctx.reply("Please connect to a voice chat.");
            return;
        }
    }

    const track = await player.addTrack(query, ctx.user);

    if (!player.nowPlaying) {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Preparing player.");

        player.setMessage(await ctx.channel.send({ embeds: [embed] }));
        await player.play();
    }


    const embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle(track.title)
        .setDescription("Has been pushed to queue.")
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setAuthor(`@${ctx.user.tag}`, ctx.user.avatarURL() as string);

    try {
        await ctx.reply({ embeds: [embed] });
    } catch {}

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
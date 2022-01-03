import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";
import { run as connect } from "./connect";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("query");

    const player = await connect(client, ctx, false);

    if (!player)
        return;

    await ctx.deferReply();

    let embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle("Now playing.")
        .setAuthor({ name:`@${ctx.user.tag}`, iconURL: ctx.user.avatarURL() as string });

    if (query) {
        const track = await player.addTrack(query, ctx.user);

        if (!track) {
            embed = new MessageEmbed()
                .setColor(quetzaConfig.color as ColorResolvable)
                .setTitle("Cannot append the track or playlist.")
                .setAuthor({ name: `@${ctx.user.tag}`, iconURL: ctx.user.avatarURL() as string });
        }
        else {
            embed = new MessageEmbed()
                .setColor(quetzaConfig.color as ColorResolvable)
                .setTitle(track.title)
                .setDescription("Has been pushed to queue.")
                .setURL(track.url)
                .setThumbnail(track.thumbnail)
                .setAuthor({ name: `@${ctx.user.tag}`, iconURL: ctx.user.avatarURL() as string });
            console.log(`${track.title} added to ${ctx.guildId}`);
        }
            
    }

    await ctx.editReply({ embeds: [embed] });

    if (!player.NowPlaying) {
        await player.play();
    }
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
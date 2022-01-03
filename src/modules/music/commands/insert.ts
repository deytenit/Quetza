import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const pos = ctx.options.getInteger("position");
    const query = ctx.options.getString("query");

    if (!ctx.guild || !query || pos === null)
        return;

    const player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply()

    const track = await player.addTrack(query, ctx.user, pos - 1);
    let embed: MessageEmbed;

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


    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "insert",
    description: "Insert new track to specific position.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING",
            required: true
        },
        {
            name: "position",
            description: "Position to insert.",
            type: "INTEGER",
            required: true
        }
    ]
}

export { data }
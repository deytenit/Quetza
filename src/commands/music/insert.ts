import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const pos = ctx.options.getInteger("position");
    const query = ctx.options.getString("query");

    if (!ctx.guild || !query || pos === null)
        return;

    const player = client.players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply()

    const track = await player.addTrack(query, ctx.user, pos - 1);

    const embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle(track.title)
        .setDescription("Has been inserted to queue.")
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setAuthor(`@${ctx.user.tag}`, ctx.user.avatarURL() as string);

    console.log(`${track.title} added to ${ctx.guildId}`);

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
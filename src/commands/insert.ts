import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const pos = ctx.options.getString("position");
    const query = ctx.options.getString("query");

    if (ctx.guildId === null || query === null)
        return;


    let player = client.players.getPlayer(ctx.guildId);

    if (!player)
        return;

    let state: boolean;

    if (!isNaN(Number(query))) {
        await player.addTrack(query, ctx.user, Number(query) - 1);
    }

    const embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Inserted.");

    try {
        await ctx.reply({ embeds: [embed] });
    } catch { }

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
            type: "STRING",
            required: true
        }
    ]
}

export { data }
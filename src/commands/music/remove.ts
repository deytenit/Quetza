import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("position");

    if (ctx.guild === null || query === null)
        return;


    let player = client.players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    let state: boolean;

    if (!isNaN(Number(query))) {
        state = await player.remove(Number(query) - 1);
    } else {
        state = await player.remove(query);
    }

    let embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Could not find track specified.");

    if (state) {
        embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Removed.");
    }

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "remove",
    description: "Remove specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to remove.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
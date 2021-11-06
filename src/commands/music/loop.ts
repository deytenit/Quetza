import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("option");

    if (ctx.guild === null || query === null)
        return;


    let player = client.players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    let state: boolean;

    if (!isNaN(Number(query))) {
        state = await player.jump(Number(query) - 1);
    } else {
        state = await player.jump(query);
    }

    let embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Could not find track specified.");

    if (state) {
        embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Jumped.");
    }

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "loop",
    description: "Set player loop option.",
    options: [
        {
            name: "option",
            description: "Set player to...",
            type: "STRING",
            required: true,
            choices: [
                { name: "loop queue", value: "LOOP" },
                { name: "loop current track", value: "SONG" },
                { name: "Destroy player on end", value: "NONE" }
            ]
        }
    ]
}

export { data }

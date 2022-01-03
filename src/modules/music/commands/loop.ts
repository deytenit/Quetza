import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("option");

    if (ctx.guild === null || query === null)
        return;


    let player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    player.repeat(query);

    let embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable);

    switch (query) {
        case "LOOP": {
            embed.setTitle("Now looping queue.");
            break;
        }
        case "SONG": {
            embed.setTitle("Now looping current song.");
            break;
        }
        case "NONE": {
            embed.setTitle("After queue end player will be destroyed.")
        }
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

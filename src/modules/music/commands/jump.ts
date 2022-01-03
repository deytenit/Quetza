import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("position");

    if (ctx.guild === null || query === null)
        return;


    let player = client.Modules["music"].control.getPlayer(ctx.guild.id);

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
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle("Could not find track specified.");

    if (state) {
        embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle("Jumped.");
    }

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "jump",
    description: "Jump to specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to jump to.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
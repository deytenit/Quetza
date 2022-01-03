import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const volume = ctx.options.getInteger("volume");

    if (ctx.guild === null || volume === null)
        return;


    let player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    let embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle(`Error occured while setting the volume.`);

    if (player.volume(volume)) {
        embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`Volume has been set to ${volume / 100}.`);
    }

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "volume",
    description: "Set music volume.",
    options: [
        {
            name: "volume",
            description: "Volume to switch to in percents.",
            type: "INTEGER",
            required: true
        }
    ]
}

export { data }
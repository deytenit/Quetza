import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const hours = ctx.options.getInteger("hrs") as number;
    const minutes = ctx.options.getInteger("mins") as number;
    const seconds = ctx.options.getInteger("secs") as number;

    if (ctx.guild === null)
        return;

    const time = hours * 3600 + minutes * 60 + seconds;

    let player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (player) {
        await ctx.deferReply();

        await player.seek(time);

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`Fastforwarded to ${hours}:${minutes}.${seconds}.`);

        await ctx.editReply({ embeds: [embed] });
    }
}

const data = {
    name: "seek",
    description: "Fastforward to timecode.",
    options: [
        {
            name: "hrs",
            description: "Hour to seek.",
            type: "INTEGER",
            required: false
        },
        {
            name: "mins",
            description: "Minute to seek.",
            type: "INTEGER",
            required: false
        },
        {
            name: "secs",
            description: "Second to seek.",
            type: "INTEGER",
            required: false
        }
    ]
}

export { data }
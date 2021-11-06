import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const hours = ctx.options.getInteger("hrs");
    const minutes = ctx.options.getInteger("mins");
    const seconds = ctx.options.getInteger("secs");

    if (ctx.guild === null || (hours === null && minutes === null && seconds === null))
        return;

    let time = 0;

    if (hours !== null)
        time += hours * 3600;
    if (minutes !== null)
        time += minutes * 60;
    if (seconds !== null)
        time += seconds;


    let player = client.players.getPlayer(ctx.guild.id);

    if (player) {
        await ctx.deferReply();

        await player.seek(time);

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
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
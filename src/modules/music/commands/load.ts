import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";
import { QueueStorage } from "../assets/QuetzaMusic/QueueStorage";
import { run as connect } from "./connect";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const title = ctx.options.getString("title");

    if (ctx.guild === null || title === null)
        return;


    const player = await connect(client, ctx, false);

    if (!player)
        return;

    const data = new QueueStorage(`./data/queues/${ctx.guild.id}.json`);

    const slot = data.getEntry(title);

    if (slot) {
        player.Queue = player.Queue.concat(slot.tracks);
        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`${title} has been appended to queue.`)
            .setDescription(slot.description);

        await ctx.reply({ embeds: [embed] });
    }

    if (!player.NowPlaying) {
        await player.play();
    }
}

const data = {
    name: "load",
    description: "Load queue to current queue.",
    options: [
        {
            name: "title",
            description: "Load slot title.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
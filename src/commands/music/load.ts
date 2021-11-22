import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";
import { QueueStorage } from "../../assets/QueueStorage";
import { run as connect } from "./connect";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const title = ctx.options.getString("title");

    if (ctx.guild === null || title === null)
        return;


    const player = await connect(client, ctx, false);

    if (!player)
        return;

    const data = new QueueStorage(`./data/queues/${ctx.guild.id}.json`);

    const slot = data.getEntry(title);

    if (slot) {
        player.queue = player.queue.concat(slot.tracks);
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`${title} has been appended to queue.`)
            .setDescription(slot.description);

        await ctx.reply({ embeds: [embed] });
    }

    if (!player.nowPlaying) {
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
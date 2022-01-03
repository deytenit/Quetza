import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";
import { QueueStorage } from "../assets/QuetzaMusic/QueueStorage";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const title = ctx.options.getString("title");

    if (ctx.guild === null || title === null)
        return;

    const data = new QueueStorage(`./data/queues/${ctx.guild.id}.json`);

    const slot = data.getEntry(title);

    if (slot) {
        if (slot.owner === ctx.user.id) {
            data.removeEntry(title);

            const embed = new MessageEmbed()
                .setColor(quetzaConfig.color as ColorResolvable)
                .setTitle(`${title} has been deleted.`)
                .setDescription(slot.description);

            await ctx.reply({ embeds: [embed] });

            data.saveData(`./data/queues/${ctx.guild.id}.json`);
        }
        else {
            const embed = new MessageEmbed()
                .setColor(quetzaConfig.color as ColorResolvable)
                .setTitle(`Sorry, but ${title} save is not yours. You can not do that.`);
            await ctx.editReply({ embeds: [embed] });
        }
    }
}

const data = {
    name: "delete",
    description: "Load queue to current queue.",
    options: [
        {
            name: "title",
            description: "Delete slot title.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
import { design } from "../../config";

import { ButtonInteraction, CollectorFilter, ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";
import { readFile, readFileSync } from "fs";
import { QueueStorage } from "../../assets/QueueStorage";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const title = ctx.options.getString("title");
    const description = ctx.options.getString("description");

    if (ctx.guild === null || title === null || description === null)
        return;


    let player = client.players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    if (player.queue.length !== 0) {
        const data = new QueueStorage(`./data/queues/${ctx.guild.id}.json`);

        const slot = data.getEntry(title);

        if (slot) {
            if (slot.owner === ctx.user.id) {
                const embed = new MessageEmbed()
                    .setColor(design.color as ColorResolvable)
                    .setTitle(`Aww... ${title} already exists. Delete it first before saving a new one.`);
                await ctx.editReply({ embeds: [embed] });
                return;
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(design.color as ColorResolvable)
                    .setTitle(`Sorry, but ${title} save is not yours. You can not do that.`);
                await ctx.editReply({ embeds: [embed] });
                return;
            }
        }

        data.createEntry(player.queue, title, description, ctx.user.id);
        data.saveData(`./data/queues/${ctx.guild.id}.json`)

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`I will create new save entry ${title}`);

        await ctx.editReply({ embeds: [embed] });
    }
    else {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`Looks like an issue. Make sure you are doing it well`);

        await ctx.editReply({ embeds: [embed] });
    }

}

const data = {
    name: "save",
    description: "Save queue to guild storage.",
    options: [
        {
            name: "title",
            description: "Save slot title.",
            type: "STRING",
            required: true
        },
        {
            name: "description",
            description: "Save slot description.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
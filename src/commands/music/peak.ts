import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";
import { QueueStorage } from "../../assets/DiscordMusic/QueueStorage";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    await ctx.deferReply();

    const data = new QueueStorage(`./data/queues/${ctx.guild.id}.json`);

    let embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle(`${ctx.guild.name} queues:`);

    data.Data.forEach((entry, title) => {
        embed.addField(title, entry.description);
    });

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "peak",
    description: "Peak at guild storage."
}

export { data }
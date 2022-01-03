import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";




export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    await ctx.deferReply();

    const embed = new MessageEmbed()
        .setColor(quetzaConfig.color as ColorResolvable)
        .setTitle("Quetza applied modules:");

    for (const value of Object.values(client.Modules)) {
        embed.addField(
            value.data.name,
            `${value.data.description} (${value.data.author})`
        );
    }    

    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "modules",
    description: "Print out list of accessable modules."
}

export { data }
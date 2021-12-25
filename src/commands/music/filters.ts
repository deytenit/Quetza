import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;


    const player = client.Players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    const filters: string[] = player.Filters();

    let embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle(player.Filters().length != 0 ? `Player active filters` : `There are no active filters.`);
    filters.forEach((filter: string) => {
        embed.addField(
            filter,
            "*",
            true
        );
    });
    await ctx.editReply({ embeds: [embed] });
}

const data = {
    name: "filters",
    description: "Print out list of active filters."
}

export { data }
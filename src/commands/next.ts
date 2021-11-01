import { design } from "../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guildId === null)
        return;


    const player = client.players.getPlayer(ctx.guildId);

    if (player)
        player.skip();

    const embed = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Skipped.");

    try {
        await ctx.reply({ embeds: [embed] });
    } catch { }
}

const data = {
    name: "next",
    description: "Skip current song."
}

export { data }
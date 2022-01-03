import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;


    const player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (player) {
        player.skip();

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle("Skipped.");

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "next",
    description: "Skip current song."
}

export { data }
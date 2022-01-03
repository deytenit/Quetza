import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    await ctx.deferReply();
    if (ctx.guild === null)
        return;

    const player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (player) {
        player.clear();

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle("Queue has been cleared.");

        await ctx.editReply({ embeds: [embed] });
    }
}

const data = {
    name: "clear",
    description: "Clears queue."
}

export { data }
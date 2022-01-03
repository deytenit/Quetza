import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (player) {
        const state = player.pause();

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`Player is now ${state ? "paused" : "resumed"}.`);

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "pause",
    description: "Toggle pause.",
}

export { data }
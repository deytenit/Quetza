import { quetzaConfig } from "../../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";



export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.Modules["music"].control.getPlayer(ctx.guild.id);

    if (player) {
        player.destroy();

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`Player is now destroyed.`);

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "stop",
    description: "Destroys player.",
}

export { data }
import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.players.getPlayer(ctx.guild.id);

    if (player) {
        const state = player.pause();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`Player is now ${state ? "paused" : "resumed"}.`);

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "pause",
    description: "Toggle pause.",
}

export { data }
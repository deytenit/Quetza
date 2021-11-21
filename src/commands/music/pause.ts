import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.players.getPlayer(ctx.guild.id);

    if (player) {
        const state = player.pause();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`Pause is now ${state ? "resumed" : "paused"}.`);

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "pause",
    description: "Toggle pause.",
}

export { data }
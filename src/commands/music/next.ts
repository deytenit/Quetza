import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;


    const player = client.players.getPlayer(ctx.guild.id);

    if (player) {
        player.skip();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Skipped.");

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "next",
    description: "Skip current song."
}

export { data }
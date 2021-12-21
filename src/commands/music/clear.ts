import { design } from "../../config";

import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    await ctx.deferReply();
    if (ctx.guild === null)
        return;

    const player = client.Players.getPlayer(ctx.guild.id);

    if (player) {
        player.clear();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Queue has been cleared.");

        await ctx.editReply({ embeds: [embed] });
    }
}

const data = {
    name: "clear",
    description: "Clears queue."
}

export { data }
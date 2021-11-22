import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.players.getPlayer(ctx.guild.id);

    if (player) {
        player.destroy();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`Player is now destroyed.`);

        await ctx.reply({ embeds: [embed] });
    }
}

const data = {
    name: "stop",
    description: "Destroys player.",
}

export { data }
import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const query = ctx.options.getString("position");

    if (ctx.guildId === null || query === null)
        return;


    let player = client.players.getPlayer(ctx.guildId);

    if (!player)
        return;

    let state: boolean;

    if (!isNaN(Number(query))) {
        state = await player.remove(Number(query) - 1);
    } else {
        state = await player.remove(query);
    }

    if (state) {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Removed.");

        try {
            await ctx.reply({ embeds: [embed] });
        } catch { }
    }

}

const data = {
    name: "remove",
    description: "Remove specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to remove.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
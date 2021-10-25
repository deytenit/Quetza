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
        state = await player.jump(Number(query) - 1);
    } else {
        state = await player.jump(query);
    }

    if (state) {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Jumped.");

        try {
            await ctx.reply({ embeds: [embed] });
        } catch { }
    }

}

const data = {
    name: "jump",
    description: "Jump to specific track in queue.",
    options: [
        {
            name: "position",
            description: "Position to jump to.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
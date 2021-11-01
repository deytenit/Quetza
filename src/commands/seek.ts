import { design } from "../config";

import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const time = ctx.options.getInteger("time");

    if (ctx.guildId === null || time === null)
        return;


    let player = client.players.getPlayer(ctx.guildId);

    if (player)
        await player.seek(time);
}

const data = {
    name: "seek",
    description: "Fastforward to timecode.",
    options: [
        {
            name: "time",
            description: "Timecode to seek.",
            type: "INTEGER",
            required: true
        }
    ]
}

export { data }
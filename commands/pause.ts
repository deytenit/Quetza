import { design } from "../config";

import { ButtonInteraction, ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { MyClient } from "../types/Client";
import { generateQueue } from "../types/Misc";
import { EmojiIdentifierResolvable } from "discord.js";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guildId === null)
        return;

    const player = client.players.getPlayer(ctx.guildId);

    if (player) {
        const state = player.pause();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`Pause is now ${state ? "on" : "off"}.`);

        try {
            await ctx.reply({ embeds: [embed] });
        } catch { }
    }


}

const data = {
    name: "pause",
    description: "Toggle pause.",
}

export { data }
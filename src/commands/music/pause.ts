import { design } from "../../config";

import { ButtonInteraction, ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { MyClient } from "../../types/Client";
import { generateQueue } from "../../types/Misc";
import { EmojiIdentifierResolvable } from "discord.js";



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
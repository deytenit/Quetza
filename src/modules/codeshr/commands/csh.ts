import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";

import { ColorResolvable, CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";
import fetch from "node-fetch";


export async function run(client: QuetzaClient, ctx: CommandInteraction) {
    const content = ctx.options.getString("content");

    if (!content) {
        return;
    }

    await ctx.deferReply();

    try {
        const response: {id: string} = await fetch("https://unknowableshade.ru/api/share", { method: "post", body: JSON.stringify({content: content, lang: "plain text", isBigId: false}), headers: {'Content-Type': 'application/json'} }).then(res => res.json());

        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle(`https://unknowableshade.ru/csh/${response.id}`)
            .setURL(`https://unknowableshade.ru/csh/${response.id}`);

        await ctx.editReply({ embeds: [embed] });
    }
    catch {
        const embed = new MessageEmbed()
            .setColor(quetzaConfig.color as ColorResolvable)
            .setTitle("Unable to maintain this request.");

        ctx.editReply({embeds: [embed]});
    }
}
const data = {
    name: "csh",
    description: "Create shareable text note.",
    options: [
        {
            name: "content",
            description: "Text to share.",
            type: "STRING",
            required: true
        }
    ]
}

export { data }
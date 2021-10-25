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
        const queue = player.queue;

        if (queue.length === 0) {
            const embed = new MessageEmbed()
                .setColor(design.color as ColorResolvable)
                .setTitle("Queue is empty.");

            try {
                await ctx.reply({ embeds: [embed] });
            } catch { }
        }
        else {
            let page = 0;
            const maxPage = Math.floor(queue.length / 11);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("QueueTop")
                        .setLabel("TOP")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("QueueUp")
                        .setLabel("UP")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("QueueDown")
                        .setLabel("DOWN")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("QueueEnd")
                        .setLabel("END")
                        .setStyle("SECONDARY")
                );

            await ctx.reply({
                content: generateQueue(queue, page, player.queuePosition),
                components: [row]
            });

            const filter = (btn: ButtonInteraction) => btn.message === ctx.fetchReply() as unknown as Message;

            const collector = ctx.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on("collect", async (btn: ButtonInteraction) => {
                switch (btn.customId) {
                    case "QueueTop": page = 0;
                    case "QueueUp": page = Math.max(page - 1, 0);
                    case "QueueDown": page = Math.min(page + 1, maxPage);
                    case "QueueEnd": page = maxPage;
                }

                await btn.update({
                    content: generateQueue(queue, page, player.queuePosition)
                });
            });

        }
    }
        

}

const data = {
    name: "queue",
    description: "Send player queue.",
}

export { data }
import { design } from "../../config";

import {
    ButtonInteraction, CollectorFilter, ColorResolvable,
    CommandInteraction, Message, MessageActionRow,
    MessageButton, MessageComponentInteraction, MessageEmbed
} from "discord.js";

import { MyClient } from "../../assets/MyClient";
import { queueDesigner } from "../../assets/Misc";



export async function run(client: MyClient, ctx: CommandInteraction) {
    if (ctx.guild === null)
        return;

    const player = client.Players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();
    const queue = player.Queue;

    if (queue.length === 0) {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Queue is empty.");

        await ctx.editReply({ embeds: [embed] });
        return;
    }

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

    const playTime = player.NowPlaying?.playbackDuration as number;
    const nowPlayingTime = player.NowPlaying?.metadata.duration as number;

    const message = await ctx.editReply({
        embeds: [queueDesigner(queue, page, player.NowPlayingPos)
            .setDescription(`${Math.floor(playTime / 60000)}:${playTime / 1000 % 60} / ${Math.floor(nowPlayingTime / 60000)}:${nowPlayingTime / 1000 % 60}`)
        ],
        components: [row]
    }) as Message;

    const collector = message.createMessageComponentCollector({ time: 15000 });

    collector.on("collect", async (btn: ButtonInteraction) => {
        console.log(page);
        switch (btn.customId) {
            case "QueueTop": { page = 0; break; }
            case "QueueUp": { page = Math.max(page - 1, 0); break; }
            case "QueueDown": { page = Math.min(page + 1, maxPage); break; }
            case "QueueEnd": page = maxPage;
        }

        const playTime = player.NowPlaying?.playbackDuration as number;
        const nowPlayingTime = player.NowPlaying?.metadata.duration as number;
    
        await btn.update({
            embeds: [queueDesigner(queue, page, player.NowPlayingPos)
                .setDescription(`${Math.floor(playTime / 60000)}:${playTime / 1000 % 60} / ${Math.floor(nowPlayingTime / 60000)}:${nowPlayingTime / 1000 % 60}`)
            ]
        });
    });
}

const data = {
    name: "queue",
    description: "Send player queue.",
}

export { data }
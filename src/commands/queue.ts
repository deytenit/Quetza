import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageButton,
} from "discord.js";

import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    await ctx.deferReply();

    if (player.Queue.empty()) {
        await ctx.editReply({ embeds: [I8n.en.queueEmpty()] });
        return;
    }

    let page = 0;

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("QueueTop")
            .setLabel("🔼")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("QueueUp")
            .setLabel("🔺")
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId("QueueDown")
            .setLabel("🔻")
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId("QueueEnd")
            .setLabel("🔽")
            .setStyle("PRIMARY")
    );

    const message = (await ctx.editReply({
        embeds: [I8n.en.queueDesigner(player.Queue, 0, player.Resource)],
        components: [row],
    })) as Message;

    const collector = message.createMessageComponentCollector({ time: 30000 });

    collector.on("collect", async (btn: ButtonInteraction) => {
        switch (btn.customId) {
        case "QueueTop": {
            page = 0;
            break;
        }
        case "QueueUp": {
            page = Math.max(page - 1, 0);
            break;
        }
        case "QueueDown": {
            page = Math.min(page + 1, Math.floor(player.Queue.Tracks.length / 11));
            break;
        }
        case "QueueEnd":
            page = Math.floor(player.Queue.Tracks.length / 11);
        }

        await btn.update({
            embeds: [I8n.en.queueDesigner(player.Queue, page, player.Resource)],
        });
    });
}

const data = {
    name: "queue",
    description: "Print out the queue.",
};

export { data };

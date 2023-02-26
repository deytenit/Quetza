import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    Message,
    MessageActionRowComponentBuilder,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import Client from "../lib/client.js";
import I18n from "../lib/i18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    await ctx.deferReply();

    if (player.Queue.empty()) {
        await ctx.editReply({ embeds: [I18n.en.queueEmpty()] });
        return;
    }

    let page = 0;

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder().setCustomId("QueueTop").setLabel("🔼").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("QueueUp").setLabel("🔺").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("QueueDown").setLabel("🔻").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("QueueEnd").setLabel("🔽").setStyle(ButtonStyle.Primary)
    );

    const message = (await ctx.editReply({
        embeds: [I18n.en.queueDesigner(player.Queue, 0, player.Resource)],
        components: [row]
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
            embeds: [I18n.en.queueDesigner(player.Queue, page, player.Resource)]
        });
    });
}

const data = new SlashCommandBuilder().setName("queue").setDescription("Print out the queue.");

export { data };

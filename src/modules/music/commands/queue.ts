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

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    await interaction.deferReply();

    if (player.queue.empty()) {
        await interaction.editReply({ embeds: [I18n.embeds.queueEmpty()] });
        return;
    }

    let page = 0;

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder().setCustomId("QueueTop").setLabel("🔼").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("QueueUp").setLabel("🔺").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("QueueDown").setLabel("🔻").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("QueueEnd").setLabel("🔽").setStyle(ButtonStyle.Primary)
    );

    const message = (await interaction.editReply({
        embeds: [I18n.embeds.queueDesigner(player.queue, 0, player.resource)],
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
                page = Math.min(page + 1, Math.floor(player.queue.tracks.length / 11));
                break;
            }
            case "QueueEnd":
                page = Math.floor(player.queue.tracks.length / 11);
        }

        await btn.update({
            embeds: [I18n.embeds.queueDesigner(player.queue, page, player.resource)]
        });
    });
}

const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Print out the queue.")
    .setDMPermission(false);

export { data, execute };

import { CommandInteraction, GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.channel || !interaction.member) {
        return;
    }

    await interaction.deferReply();

    const player =
        controller.get(interaction.guild.id, interaction.channel as TextChannel) ||
        controller.set(interaction.guild, interaction.channel as TextChannel);

    if (!player.connection) {
        const channel = (interaction.member as GuildMember).voice.channel;
        if (channel) {
            player.connect(channel);

            await interaction.editReply({ embeds: [I18n.embeds.okConnected(channel.name)] });
        } else {
            controller.delete(interaction.guild.id);

            await interaction.editReply({ embeds: [I18n.embeds.notConnected()] });
            return undefined;
        }
    } else {
        await interaction.editReply({ embeds: [I18n.embeds.wasConnected()] });
    }

    return player;
}

const data = new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connect me to a voice channel.")
    .setDMPermission(false);

export { data, execute };

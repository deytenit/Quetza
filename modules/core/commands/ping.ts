/**
 * /ping
 *
 * Replies websocket ping (ping between bot and discord) and real ping (ping to fetch + process).
 *
 * @remarks Probably should double their value as two ways, but nvm.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "$lib/client.js";

import replies from "../lib/replies.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const reply = await interaction.reply({ ...replies.ping(client.ws.ping), fetchReply: true });

    await interaction.editReply(
        replies.ping(client.ws.ping, reply.createdTimestamp - interaction.createdTimestamp)
    );
}

const data = new SlashCommandBuilder().setName("ping").setDescription("Try to ping me.");

export { data, execute };

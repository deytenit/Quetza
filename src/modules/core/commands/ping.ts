import { Interaction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const reply = await interaction.reply({ ...replies.ping(client.ws.ping), fetchReply: true });

    await interaction.editReply(
        replies.ping(client.ws.ping, reply.createdTimestamp - interaction.createdTimestamp)
    );
}

const data = new SlashCommandBuilder().setName("ping").setDescription("Try to ping me.");

export { data, execute };

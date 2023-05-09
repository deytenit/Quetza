import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    await interaction.reply(replies.modules(client.modules));
}

const data = new SlashCommandBuilder()
    .setName("modules")
    .setDescription("List of availiable modules.");

export { data, execute };

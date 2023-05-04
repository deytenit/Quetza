import { Interaction, SlashCommandBuilder } from "discord.js";

import config from "../../../config.js";
import Client from "../../../lib/client.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || interaction.user.id !== config.master) {
        return;
    }

    process.exit();
}

const data = new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Kills bot process (only for bot-master).");

export { data, execute };

import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import i18n from "../lib/i18n.js";

async function execute(client: Client, interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [i18n.modules(Array.from(client.modules.values()))] });
}

const data = new SlashCommandBuilder()
    .setName("modules")
    .setDescription("List of availiable modules.");

export { data, execute };

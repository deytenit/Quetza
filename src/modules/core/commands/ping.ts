import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import i18n from "../lib/i18n.js";

async function execute(client: Client, interaction: CommandInteraction): Promise<void> {
    const start = Date.now();

    if (!client.application) {
        await interaction.reply({ embeds: [i18n.ping(undefined)] });
        return;
    }

    await client.application.fetch();

    await interaction.reply({ embeds: [i18n.ping(Date.now() - start)] });
}

const data = new SlashCommandBuilder().setName("ping").setDescription("Try to ping me.");

export { data, execute };

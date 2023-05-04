import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { execute as connect } from "./connect.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get("query")?.value as string;

    const player = await connect(client, interaction);

    if (!player) {
        return;
    }

    if (query) {
        const track = await player.add(query, interaction.user);

        await interaction.editReply({ embeds: [I18n.embeds.appended(track)] });
    }

    if (!player.resource) {
        player.play();
    }
}

const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Launch player and add songs to the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Title or URL of the song.")
    )
    .setDMPermission(false);

export { data, execute };

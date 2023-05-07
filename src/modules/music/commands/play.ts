import { Interaction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";
import { execute as connect } from "./connect.js";

async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        return;
    }

    const query = interaction.options.getString("query");

    const player = await connect(client, interaction);

    if (!player) {
        await interaction.editReply(replies.notExists());

        return;
    }

    if (query) {
        const track = await player.add(query, interaction.user);

        await interaction.editReply(replies.appended(track));
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

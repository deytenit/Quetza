import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { execute as connect } from "./connect.js";

async function execute(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.get("query")?.value as string;

    const player = await connect(client, ctx);

    if (!player) return;

    if (query) {
        const track = await player.add(query, ctx.user);

        await ctx.editReply({ embeds: [I18n.embeds.appended(track)] });
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
    );

export { data, execute };

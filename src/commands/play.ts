import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import { run as connect } from "./connect";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.getString("query");

    const player = await connect(client, ctx);

    if (!player) return;

    if (query) {
        const track = await player.add(query, ctx.user);

        await ctx.editReply({ embeds: [I8n.en.appended(track)] });
    }

    if (!player.Resource) {
        player.play();
    }
}

const data = {
    name: "play",
    description: "Launch player and add songs to the queue.",
    options: [
        {
            name: "query",
            description: "Title or URL of the song.",
            type: "STRING"
        },
    ],
};

export { data };

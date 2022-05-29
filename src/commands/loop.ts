import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import { loopOption } from "../lib/Types";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.getString("option");

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.Queue.Loop = query as loopOption;

    await ctx.reply({ embeds: [I8n.en.looped(query as loopOption)] });
}

const data = {
    name: "loop",
    description: "Select player's loop mode.",
    options: [
        {
            name: "option",
            description: "Loop options.",
            type: "STRING",
            required: true,
            choices: [
                { name: "loop queue", value: "LOOP" },
                { name: "loop single track", value: "SONG" },
                { name: "Till end", value: "NONE" },
                { name: "Random order", value: "AUTO" },
            ],
        },
    ],
};

export { data };

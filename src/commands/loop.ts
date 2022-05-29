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
    description: "Set player loop option.",
    options: [
        {
            name: "option",
            description: "Update player loop option.",
            type: "STRING",
            required: true,
            choices: [
                { name: "loop queue", value: "LOOP" },
                { name: "loop current track", value: "SONG" },
                { name: "Destroy player on end", value: "NONE" },
                { name: "Random order without suffling queue.", value: "AUTO" },
            ],
        },
    ],
};

export { data };

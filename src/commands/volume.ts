import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const volume = ctx.options.getInteger("volume") || 100;

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.Volume = volume;

    await ctx.reply({ embeds: [I8n.en.volumeSet(player.Volume)] });
}

const data = {
    name: "volume",
    description: "Change player's volume amount.",
    options: [
        {
            name: "volume",
            description: "Volume in percents.",
            type: "INTEGER",
            required: true,
        },
    ],
};

export { data };

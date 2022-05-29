import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const hours = ctx.options.getInteger("hrs") || 0;
    const minutes = ctx.options.getInteger("mins") || 0;
    const seconds = ctx.options.getInteger("secs") || 0;

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    const time = hours * 3600 + minutes * 60 + seconds;

    player.seek(time * 1000);

    await ctx.reply({
        embeds: [I8n.en.fastForwarded(time)],
    });
}

const data = {
    name: "seek",
    description: "Fast-forward to timecode.",
    options: [
        {
            name: "hrs",
            description: "Hours to seek.",
            type: "INTEGER",
            required: false,
        },
        {
            name: "mins",
            description: "Minutes to seek.",
            type: "INTEGER",
            required: false,
        },
        {
            name: "secs",
            description: "Seconds to seek.",
            type: "INTEGER",
            required: false,
        },
    ],
};

export { data };

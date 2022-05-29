import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const filter = ctx.options.getString("filter");

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.setFilter(filter || undefined);

    await ctx.reply({ embeds: [I8n.en.filtered(filter || undefined)] });
}

const data = {
    name: "filter",
    description: "Apply unique filters to the player's tracks.",
    options: [
        {
            name: "filter",
            description: "Filter to apply...",
            type: "STRING",
            choices: [
                {
                    name: "bassboost_low",
                    value: "bassboost_low",
                },
                {
                    name: "bassboost",
                    value: "bassboost",
                },
                {
                    name: "bassboost_high",
                    value: "bassboost_high",
                },
                {
                    name: "8D",
                    value: "8D",
                },
                {
                    name: "vaporwave",
                    value: "vaporwave",
                },
                {
                    name: "nightcore",
                    value: "nightcore",
                },
                {
                    name: "phaser",
                    value: "phaser",
                },
                {
                    name: "tremolo",
                    value: "tremolo",
                },
                {
                    name: "vibrato",
                    value: "vibrato",
                },
                {
                    name: "reverse",
                    value: "reverse",
                },
                {
                    name: "treble",
                    value: "treble",
                },
                {
                    name: "normalizer",
                    value: "normalizer",
                },
                {
                    name: "surrounding",
                    value: "surrounding",
                },
                {
                    name: "pulsator",
                    value: "pulsator",
                },
                {
                    name: "subboost",
                    value: "subboost",
                },
                {
                    name: "mono",
                    value: "mono",
                },
                {
                    name: "compressor",
                    value: "compressor",
                },
                {
                    name: "expander",
                    value: "expander",
                },
                {
                    name: "softlimiter",
                    value: "softlimiter",
                },
                {
                    name: "chorus",
                    value: "chorus",
                },
                {
                    name: "fadein",
                    value: "fadein",
                },
                {
                    name: "dim",
                    value: "dim",
                },
                {
                    name: "earrape",
                    value: "earrape",
                },
            ],
            required: false,
        },
    ],
};

export { data };

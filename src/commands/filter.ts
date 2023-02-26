import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../lib/client.js";
import I18n from "../lib/i18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    const filter = ctx.options.get("filter")?.value as string;

    if (!ctx.guild || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    player.setFilter(filter || undefined);

    await ctx.reply({ embeds: [I18n.en.filtered(filter || undefined)] });
}

const data = new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Apply unique filters to the tracks.")
    .addStringOption((option) =>
        option
            .setName("filter")
            .setDescription("Filter to apply.")
            .setChoices(
                {
                    name: "bassboost_low",
                    value: "bassboost_low"
                },
                {
                    name: "bassboost",
                    value: "bassboost"
                },
                {
                    name: "bassboost_high",
                    value: "bassboost_high"
                },
                {
                    name: "8D",
                    value: "8D"
                },
                {
                    name: "vaporwave",
                    value: "vaporwave"
                },
                {
                    name: "nightcore",
                    value: "nightcore"
                },
                {
                    name: "phaser",
                    value: "phaser"
                },
                {
                    name: "tremolo",
                    value: "tremolo"
                },
                {
                    name: "vibrato",
                    value: "vibrato"
                },
                {
                    name: "reverse",
                    value: "reverse"
                },
                {
                    name: "treble",
                    value: "treble"
                },
                {
                    name: "normalizer",
                    value: "normalizer"
                },
                {
                    name: "surrounding",
                    value: "surrounding"
                },
                {
                    name: "pulsator",
                    value: "pulsator"
                },
                {
                    name: "subboost",
                    value: "subboost"
                },
                {
                    name: "mono",
                    value: "mono"
                },
                {
                    name: "compressor",
                    value: "compressor"
                },
                {
                    name: "expander",
                    value: "expander"
                },
                {
                    name: "softlimiter",
                    value: "softlimiter"
                },
                {
                    name: "chorus",
                    value: "chorus"
                },
                {
                    name: "fadein",
                    value: "fadein"
                },
                {
                    name: "dim",
                    value: "dim"
                },
                {
                    name: "earrape",
                    value: "earrape"
                }
            )
            .setRequired(true)
    );

export { data };

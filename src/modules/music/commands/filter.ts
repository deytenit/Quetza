import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const filter = interaction.options.get("filter")?.value as string;

    if (!interaction.guild || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    player.setFilter(filter || undefined);

    await interaction.reply({ embeds: [I18n.embeds.filtered(filter || undefined)] });
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
                    name: "Bassboost low",
                    value: "bassboost_low"
                },
                {
                    name: "Bassboost",
                    value: "bassboost"
                },
                {
                    name: "Bassboost high",
                    value: "bassboost_high"
                },
                {
                    name: "8D",
                    value: "8D"
                },
                {
                    name: "Vaporwave",
                    value: "vaporwave"
                },
                {
                    name: "Nightcore",
                    value: "nightcore"
                },
                {
                    name: "Phaser",
                    value: "phaser"
                },
                {
                    name: "Tremolo",
                    value: "tremolo"
                },
                {
                    name: "Vibrato",
                    value: "vibrato"
                },
                {
                    name: "Reverse",
                    value: "reverse"
                },
                {
                    name: "Treble",
                    value: "treble"
                },
                {
                    name: "Normalizer",
                    value: "normalizer"
                },
                {
                    name: "Surround Sound",
                    value: "surrounding"
                },
                {
                    name: "Pulsator",
                    value: "pulsator"
                },
                {
                    name: "Subboost",
                    value: "subboost"
                },
                {
                    name: "Mono Audio",
                    value: "mono"
                },
                {
                    name: "Compressor",
                    value: "compressor"
                },
                {
                    name: "Expander",
                    value: "expander"
                },
                {
                    name: "Softlimiter",
                    value: "softlimiter"
                },
                {
                    name: "Chorus",
                    value: "chorus"
                },
                {
                    name: "Fadein",
                    value: "fadein"
                },
                {
                    name: "Dimming",
                    value: "dim"
                },
                {
                    name: "Earrape",
                    value: "earrape"
                }
            )
            .setRequired(true)
    )
    .setDMPermission(false);

export { data, execute };

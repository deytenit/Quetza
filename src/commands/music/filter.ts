import { design } from "../../config";

import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import { MyClient } from "../../assets/MyClient";



export async function run(client: MyClient, ctx: CommandInteraction) {
    const filter = ctx.options.getString("filter");

    if (ctx.guild === null)
        return;


    const player = client.Players.getPlayer(ctx.guild.id);

    if (!player)
        return;

    await ctx.deferReply();

    if (await player.filter(filter)) {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(filter ? `${filter} filter is setted up.` : "Filters have been cleared.");
        await ctx.editReply({ embeds: [embed] });
    }
    else {
        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(`An error occurred while setting up the filter.`);
        await ctx.editReply({ embeds: [embed] });
    }
}

const data = {
    name: "filter",
    description: "Apply unique filters to a track.",
    options: [
        {
            name: "filter",
            description: "Filter to apply.",
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
                }
            ],
            required: false
        }
    ]
}

export { data }
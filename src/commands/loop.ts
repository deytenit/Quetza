import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Client from "../lib/Client";
import { loopOption } from "../lib/Types";
import I18n from "../lib/I18n";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.get("option")?.value as string;

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel);

    if (!player) return;

    player.Queue.Loop = query as loopOption;

    await ctx.reply({ embeds: [I18n.en.looped(query as loopOption)] });
}

const data = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Select player's loop mode.")
    .addStringOption(option => option
        .setName("option")
        .setDescription("Select loop option.")
        .setChoices(                { name: "loop queue", value: "LOOP" },
            { name: "loop single track", value: "SONG" },
            { name: "Till end", value: "NONE" },
            { name: "Random order", value: "AUTO" })
        .setRequired(true));

export { data };

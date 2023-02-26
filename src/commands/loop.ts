import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../lib/client.js";
import I18n from "../lib/i18n.js";
import { loopOption } from "../lib/types.js";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.get("option")?.value as string;

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    player.Queue.Loop = query as loopOption;

    await ctx.reply({ embeds: [I18n.en.looped(query as loopOption)] });
}

const data = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Select player's loop mode.")
    .addStringOption((option) =>
        option
            .setName("option")
            .setDescription("Select loop option.")
            .setChoices(
                { name: "loop queue", value: "LOOP" },
                { name: "loop single track", value: "SONG" },
                { name: "Till end", value: "NONE" },
                { name: "Random order", value: "AUTO" }
            )
            .setRequired(true)
    );

export { data };

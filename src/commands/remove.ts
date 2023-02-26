import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../lib/client.js";
import I18n from "../lib/i18n.js";

export async function run(client: Client, ctx: CommandInteraction) {
    const query = ctx.options.get("query")?.value as string;

    if (!ctx.guild || !query || !ctx.channel) return;

    const player = client.modules.music.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    const track =
        !isNaN(+query) && isFinite(+query) && !/e/i.test(query)
            ? player.remove(parseInt(query) - 1)
            : player.remove(query);

    await ctx.reply({ embeds: [I18n.en.removed(track)] });
}

const data = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove specific track in the queue.")
    .addStringOption((option) =>
        option.setName("query").setDescription("Position or title to remove.").setRequired(true)
    );

export { data };

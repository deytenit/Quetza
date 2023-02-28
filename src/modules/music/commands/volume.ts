import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { controller } from "../module.js";

async function execute(client: Client, ctx: CommandInteraction) {
    const volume = (ctx.options.get("volume")?.value as number) || 100;

    if (!ctx.guild || !ctx.channel) return;

    const player = controller.get(ctx.guild.id, ctx.channel as TextChannel);

    if (!player) return;

    player.Volume = volume;

    await ctx.reply({ embeds: [I18n.en.volumeSet(player.Volume)] });
}

const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change player's volume amount.")
    .addIntegerOption((option) =>
        option.setName("volume").setDescription("Volume in percents.").setRequired(true)
    );

export { data, execute };

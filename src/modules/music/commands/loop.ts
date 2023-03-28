import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { LoopOption } from "../lib/types.js";
import { controller } from "../module.js";

async function execute(client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get("option")?.value as string;

    if (!interaction.guild || !query || !interaction.channel) {
        return;
    }

    const player = controller.get(interaction.guild.id, interaction.channel as TextChannel);

    if (!player) {
        return;
    }

    player.queue.loop = query as LoopOption;

    await interaction.reply({ embeds: [I18n.embeds.looped(query as LoopOption)] });
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

export { data, execute };

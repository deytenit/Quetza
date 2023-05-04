import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }

    if (interaction.options.getSubcommand() === "give-role") {
        const role = interaction.options.getRole("role", true);
        const event = interaction.options.getString("event", true);

        await interaction.deferReply();

        try {
            await client.db.$connect();

            await client.db.event.upsert({
                where: { eventIdentifier: { title: event, guildId: interaction.guild.id } },
                update: { Roles: [role.id] },
                create: {
                    Guild: {
                        connectOrCreate: {
                            where: { id: interaction.guild.id },
                            create: { id: interaction.guild.id }
                        }
                    },
                    title: event,
                    Roles: [role.id]
                }
            });

            await interaction.editReply(replies.auto("add role to a member", event));
        } finally {
            await client.db.$disconnect();
        }
        return;
    }
}

const data = new SlashCommandBuilder()
    .setName("auto")
    .setDescription("Server's automatization engine.")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("give-role")
            .setDescription("Auto give role on action.")
            .addRoleOption((option) =>
                option.setName("role").setDescription("Role for an action.").setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName("event")
                    .setDescription("Event when perfome an action.")
                    .setRequired(true)
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export { data, execute };

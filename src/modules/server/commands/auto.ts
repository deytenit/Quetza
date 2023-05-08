import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import config from "../config.js";
import replies from "../lib/replies.js";


async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }

    const subcommand = interaction.options.getSubcommand();
    const event = interaction.options.getString("event", true);

    switch (subcommand) {
    case "role": {
        const role = interaction.options.getRole("role", true);

        await interaction.deferReply();

        try {
            await client.db.$connect();

            await client.db.event.upsert({
                where: { eventIdentifier: { title: event, action: subcommand,  guildId: interaction.guild.id } },
                update: { metadata: [role.id] },
                create: {
                    Guild: {
                        connect: {
                            id: interaction.guild.id
                        }
                    },
                    title: event,
                    action: subcommand,
                    metadata: [role.id]
                }
            });

            await interaction.editReply(replies.auto("add role to a member", event));
        } finally {
            await client.db.$disconnect();
        }

        return;
    }
    case "warn": {
        const warining = interaction.options.getString("warning", true);
        const duration = interaction.options.getInteger("duration");

        await interaction.deferReply();

        try {
            await client.db.$connect();

            await client.db.event.upsert({
                where: { eventIdentifier: { title: event, action: subcommand,  guildId: interaction.guild.id } },
                update: { metadata: {warining, duration} },
                create: {
                    Guild: {
                        connect: {
                            id: interaction.guild.id
                        }
                    },
                    title: event,
                    action: subcommand,
                    metadata: {warining, duration}
                }
            });

            await interaction.editReply(replies.auto("warn a member", event));
        } finally {
            await client.db.$disconnect();
        }
        return;
    }
    case "exp": {
        const duration = interaction.options.getInteger("duration", true);

        await interaction.deferReply();

        try {
            await client.db.$connect();

            await client.db.event.upsert({
                where: { eventIdentifier: { title: event, action: subcommand,  guildId: interaction.guild.id } },
                update: { metadata: duration },
                create: {
                    Guild: {
                        connect: {
                            id: interaction.guild.id
                        }
                    },
                    title: event,
                    action: subcommand,
                    metadata: duration
                }
            });

            await interaction.editReply(replies.auto("warn a member", event));
        } finally {
            await client.db.$disconnect();
        }
        return; 
    }
    }
}

const data = new SlashCommandBuilder()
    .setName("auto")
    .setDescription("Quetza's automatization engine.")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("role")
            .setDescription("Auto: give role.")
            .addStringOption((option) =>
                option
                    .setName("event")
                    .setDescription("Event when perfome an action.")
                    .setChoices(...config.autoEventChoices)
                    .setRequired(true)
            )
            .addRoleOption((option) =>
                option.setName("role").setDescription("Role for an action.").setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("warn")
            .setDescription("Auto: warn member.")
            .addStringOption((option) =>
                option
                    .setName("event")
                    .setDescription("Event when perfome an action.")
                    .setChoices(...config.autoEventChoices)
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option.setName("warning").setDescription("Warning for an action.").setRequired(true)
            )
            .addIntegerOption((option) =>
                option.setName("duration").setDescription("Duration for an action.")
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("exp")
            .setDescription("Auto: give experience points.")
            .addStringOption((option) =>
                option
                    .setName("event")
                    .setDescription("Event when perfome an action.")
                    .setChoices(...config.autoEventChoices)
                    .setRequired(true)
            )
            .addIntegerOption((option) =>
                option.setName("amount").setDescription("Amount for an action.").setRequired(true)
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export { data, execute };

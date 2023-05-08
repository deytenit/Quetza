import { Events, Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
        logger.warn("Interaction rejected.", { interaction });

        return;
    }

    const subcommand = interaction.options.getSubcommand();
    const event = interaction.options.getString("event", true);

    switch (subcommand) {
        case "role": {
            const role = interaction.options.getRole("role", true);

            await interaction.deferReply();

            try {
                await client.db.event.upsert({
                    where: {
                        eventIdentifier: {
                            title: event,
                            action: subcommand,
                            guildId: interaction.guildId
                        }
                    },
                    update: { metadata: [role.id] },
                    create: {
                        Guild: {
                            connectOrCreate: {
                                where: {
                                    id: interaction.guildId
                                },
                                create: {
                                    id: interaction.guildId
                                }
                            }
                        },
                        title: event,
                        action: subcommand,
                        metadata: [role.id]
                    }
                });

                await interaction.editReply(replies.auto("add role to a member", event));
            } catch (error) {
                logger.error("Error occured while quering db.", { interaction });
            } finally {
                await client.db.$disconnect();
            }

            return;
        }
    }
}

const AUTO_EVENT_CHOICES = [
    {
        name: "Member Joins",
        value: Events.GuildMemberAdd
    }
];

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
                    .setChoices(...AUTO_EVENT_CHOICES)
                    .setRequired(true)
            )
            .addRoleOption((option) =>
                option.setName("role").setDescription("Role to grant on event.").setRequired(true)
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export { data, execute };

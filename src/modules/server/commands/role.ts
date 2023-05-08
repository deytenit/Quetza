import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }

    if (interaction.options.getSubcommand() === "check") {
        const user = interaction.options.getUser("member", true);

        const member = await interaction.guild.members.fetch(user).catch(() => undefined);

        if (member) {
            await interaction.reply(replies.roleList(user.tag, member.roles.cache));
        } else {
            await interaction.reply(replies.notMember("edited", user));
        }

        return;
    }

    if (interaction.options.getSubcommand() === "edit") {
        const user = interaction.options.getUser("member", true);
        const role = interaction.options.getRole("role", true);
        const reason = interaction.options.getString("reason") ?? undefined;

        const member = await interaction.guild.members.fetch(user).catch(() => undefined);

        if (member) {
            if (member.roles.cache.some((memberRole) => role.id === memberRole.id)) {
                await member.roles.remove(role.id, reason);
                await interaction.reply(
                    replies.roleAction("revoked from", interaction.user, role.name, reason)
                );
            } else {
                await member.roles.add(role.id, reason);
                await interaction.reply(
                    replies.roleAction("granted to", interaction.user, role.name, reason)
                );
            }
        } else {
            await interaction.reply(replies.notMember("edited", user));
        }

        return;
    }

    if (interaction.options.getSubcommand() === "list") {
        const roles = await interaction.guild.roles.fetch();

        await interaction.reply(replies.roleList(interaction.guild.name, roles));

        return;
    }
}

const data = new SlashCommandBuilder()
    .setName("role")
    .setDescription("Server's role manager.")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("list")
            .setDescription("Role: list guild's roles.")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("check")
            .setDescription("Role: check user roles.")
            .addUserOption((option) =>
                option
                    .setName("member")
                    .setDescription("Member to perfome an action.")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("edit")
            .setDescription("Role: edit role for a specific user.")
            .addUserOption((option) =>
                option
                    .setName("member")
                    .setDescription("Member to perfome an action.")
                    .setRequired(true)
            )
            .addRoleOption((option) =>
                option.setName("role").setDescription("Role for an action.").setRequired(true)
            )
            .addStringOption((option) =>
                option.setName("reason").setDescription("Reason for an action.")
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false);

export { data, execute };

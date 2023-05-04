import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? undefined;
    const deleteMessageSeconds = interaction.options.getNumber("clear") ?? undefined;

    const ban = await interaction.guild.bans.fetch(user.id).catch(() => undefined);

    if (ban) {
        await interaction.guild.members.unban(user, reason);
        await interaction.reply(replies.action("unbanned", user, reason));
    } else {
        await interaction.guild.members.ban(user, { reason, deleteMessageSeconds });
        await interaction.reply(replies.action("banned", user, reason));
    }
}

const data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("(un)Ban player from the guild.")
    .addUserOption((option) =>
        option.setName("user").setDescription("User to perfome an action.").setRequired(true)
    )
    .addStringOption((option) => option.setName("reason").setDescription("Reason for an action."))
    .addNumberOption((option) =>
        option
            .setName("clear")
            .setDescription("Seconds past current time to delete user's messages in case of a ban.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false);

export { data, execute };

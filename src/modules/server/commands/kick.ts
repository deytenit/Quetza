import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";
import replies from "../lib/replies.js";

async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }

    const user = interaction.options.getUser("member", true);
    const reason = interaction.options.getString("reason") ?? undefined;

    const member = await interaction.guild.members.fetch(user).catch(() => undefined);

    if (member) {
        await interaction.guild.members.kick(user, reason);
        await interaction.reply(replies.action("kicked", user, reason));
    } else {
        await interaction.reply(replies.notMember("kicked", user));
    }
}

const data = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick player from the guild.")
    .addUserOption((option) =>
        option.setName("member").setDescription("Member to perfome an action.").setRequired(true)
    )
    .addStringOption((option) => option.setName("reason").setDescription("Reason for an action."))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false);

export { data, execute };

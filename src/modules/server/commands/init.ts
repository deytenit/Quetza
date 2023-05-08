import { Interaction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Client from "../../../lib/client.js";


async function execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guild) {
        return;
    }
    try {
        await client.db.guild.upsert({ where: { id: interaction.guild.id }, create: { id: interaction.guild.id  }, update: {}});

        await client.db.member.createMany(...(await interaction.guild.members.fetch()).map((value) => { 
            return { data: {  userId: value.id, guildId: interaction.guild?.id ?? "" } }; 
        }));

        await interaction.reply("ok");
    }
    finally {
        await client.db.$disconnect();
    }
}

const data = new SlashCommandBuilder()
    .setName("init")
    .setDescription("Init this server in quetza's db.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export { data, execute };

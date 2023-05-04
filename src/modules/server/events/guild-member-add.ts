import { Events, GuildMember } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client, eventee: GuildMember[]): Promise<void> {
    const [member] = eventee;

    try {
        await client.db.$connect();

        const event = await client.db.event.findFirstOrThrow({
            where: { guildId: member.guild.id, title: name }
        });

        await member.roles.add(event.Roles);
    } finally {
        await client.db.$disconnect();
    }
}

const name = Events.GuildMemberAdd;

export { execute, name };

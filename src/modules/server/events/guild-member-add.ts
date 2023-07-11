import { Events, GuildMember } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client, eventee: [GuildMember]): Promise<void> {
    const [member] = eventee;

    try {
        const event = await client.db.event.findFirst({
            where: { guildId: member.guild.id, title: name }
        });

        if (event) {
            await member.roles.add(event.metadata as string[]);
        }
    } finally {
        await client.db.$disconnect();
    }
}

const name = Events.GuildMemberAdd;

export { execute, name };

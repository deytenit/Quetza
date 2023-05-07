import { Events, Interaction } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client, eventee: Interaction[]): Promise<void> {
    const [interaction] = eventee;

    client.log.info("Interaction created.", interaction);

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (command) {
            command.execute(client, interaction);
        }
    }
}

const name = Events.InteractionCreate;

export { execute, name };

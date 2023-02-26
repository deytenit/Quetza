import { Interaction } from "discord.js";

import Client from "../lib/client.js";

export async function run(client: Client, args: Interaction[]): Promise<void> {
    const [interaction] = args;

    if (interaction.isCommand()) {
        const command = client.Commands.get(interaction.commandName);

        if (command) command.run(client, interaction);
    }
}

export const name = "interactionCreate";

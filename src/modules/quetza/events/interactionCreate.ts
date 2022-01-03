import { Interaction } from "discord.js";
import { QuetzaClient } from "../../../assets/QuetzaClient";

export async function run(client: QuetzaClient, args: Interaction[]): Promise<void> {
    const [interaction] = args;

    if (interaction.isCommand()) {
        const command = client.Commands.get(interaction.commandName);

        if (command)
            command.run(client, interaction);
    }
}

export const name = "interactionCreate";
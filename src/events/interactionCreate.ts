import { Interaction } from "discord.js";
import { MyClient } from "../types/MyClient";

export async function run(args: Interaction[], client: MyClient): Promise<void> {
    const [interaction] = args;

    if (interaction.isCommand() && client.commands.has(interaction.commandName)) {
        const command = client.commands.get(interaction.commandName);
        command.run(client, interaction);
    }
}

export const name = "interactionCreate";
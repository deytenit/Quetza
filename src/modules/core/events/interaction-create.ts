import { Events, Interaction } from "discord.js";

import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";

async function execute(client: Client, eventee: [Interaction]): Promise<void> {
    const [interaction] = eventee;

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`, {
                interaction
            });

            return;
        }

        try {
            logger.info(`Interaction ${interaction.commandName} was created.`, interaction);

            await command.execute(client, interaction);
        } catch (error) {
            logger.error("Interaction error occured. ", { error, interaction });
        }
    }
}

const name = Events.InteractionCreate;

export { execute, name };

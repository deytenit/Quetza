/**
 * InteractionCreate
 *
 * Resolves creation of an interaction by users.
 *
 * @remark Only {@link ChatInputCommand} currently being resolved.
 *
 * @packageDocumentation
 */
import { Events, Interaction } from "discord.js";

import Client from "$lib/client.js";
import logger from "$lib/logger.js";

async function execute(client: Client, eventee: [Interaction]): Promise<void> {
    const [interaction] = eventee;

    if (!interaction.isChatInputCommand()) {
        logger.notice("Interaction is not a ChatInputCommand.");
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        logger.notice("Interaction does not exist.", interaction);

        return;
    }

    try {
        logger.info("Interaction was created.", interaction);

        await command.execute(client, interaction, command.module.controller);
    } catch (error) {
        logger.error("Interaction has and error occured.", error, interaction);
    }
}

const name = Events.InteractionCreate;

export { execute, name };

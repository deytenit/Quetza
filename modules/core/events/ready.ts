import { generateDependencyReport } from "@discordjs/voice";
import { Events } from "discord.js";

import config from "$config.js";
import Client from "$lib/client.js";
import logger from "$lib/logger.js";

/**
 * Function that will execute upon emitting Client's Ready event.
 *
 * @remarks Will push slash commands, set activity status,
 * and log bot's initials.
 *
 * @param client - Quetza client.
 */
async function execute(client: Client<true>): Promise<void> {
    const commandData = client.commands.map((value) => value.data);

    // To not reload bot's global slash commands at every dev build.
    if (process.env.NODE_ENV === "development") {
        logger.info(
            "Development mode: Commands will be pushed to the _test guild_!",
            client.generateApplicationStatus()
        );
        logger.info("Dependency report by '@discordjs/voice'.", {
            report: generateDependencyReport()
        });

        const guild = await client.guilds.fetch(config.dev.guild);
        guild.commands.set(commandData);
    }

    if (process.env.NODE_ENV === "production") {
        logger.info(
            "Production mode: Commands will be pushed to the _application_!",
            client.generateApplicationStatus()
        );

        await client.application.commands.set(commandData);
    }

    client.user.setActivity(config.application.activity);
}

/** Event name. */
const name = Events.ClientReady;

export { execute, name };

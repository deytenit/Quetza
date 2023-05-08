import { generateDependencyReport } from "@discordjs/voice";
import { Events } from "discord.js";

import config from "../../../config.js";
import Client from "../../../lib/client.js";
import logger from "../../../lib/logger.js";

async function execute(client: Client): Promise<void> {
    if (!client.user || !client.application) {
        throw new Error("No application or user for it is provided.");
    }

    const commandData = Array.from(client.commands.values()).map((value) => value.data);

    if (process.env.NODE_ENV === "development" && process.env.TEST_GUILD) {
        logger.info("Development mode: Commands will be pushed to the test guild!");

        logger.info(generateDependencyReport());

        const guild = await client.guilds.fetch(process.env.TEST_GUILD);
        guild.commands.set(commandData);
    }

    if (process.env.NODE_ENV === "production") {
        logger.info("Production mode: Commands will be pushed to the application!");

        await client.application.commands.set(commandData);
    }

    client.generateApplicationStatus().forEach((report) => logger.info(report));

    client.user.setActivity(config.activityStatus);
}

const name = Events.ClientReady;

export { execute, name };

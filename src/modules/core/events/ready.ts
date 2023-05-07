import { ActivityType, Events } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client): Promise<void> {
    if (!client.user || !client.application) {
        throw new Error("No application or user for it is provided.");
    }

    const commandData = Array.from(client.commands.values()).map((value) => value.data);

    if (process.env.NODE_ENV === "development" && process.env.TEST_GUILD) {
        client.log.info("Development mode: Commands will be pushed to the test guild!");

        const guild = await client.guilds.fetch(process.env.TEST_GUILD);
        guild.commands.set(commandData);
    }

    if (process.env.NODE_ENV === "production") {
        client.log.info("Production mode: Commands will be pushed to the application!");

        await client.application.commands.set(commandData);
    }

    client.generateApplicationStatus().forEach((report) => client.log.info(report));

    client.user.setActivity({ type: ActivityType.Watching, name: "over you" });
}

const name = Events.ClientReady;

export { execute, name };

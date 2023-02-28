import { generateDependencyReport } from "@discordjs/voice";
import { ActivityType } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client): Promise<void> {
    if (!client.user || !client.application) {
        console.log("No user or application is provided!");
        process.exit(1);
    }

    console.log(`${client.user.username} logged in as ${client.user.tag}!`);
    console.log(generateDependencyReport());
    client.user.setActivity("over you", { type: ActivityType.Watching });

    const restCommands = Array.from(client.commands.values()).map((value) => value.data);

    client.application.commands.set(restCommands);
}

const name = "ready";

export { execute, name };

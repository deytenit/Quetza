import { generateDependencyReport } from "@discordjs/voice";
import { ActivityType } from "discord.js";

import Client from "../../../lib/client.js";

function generateApplicationStatus(client: Client): string {
    const modulesStatus = Array.from(client.modules.values())
        .map((module) => `✓ ${module.name}@${module.tag} module is loaded.`)
        .join("\n");

    const clientStatus =
        client.user && client.application
            ? `✓ ${client.application.id} successfully logged in as ${client.user.tag}.`
            : "✖ Application is not availiable.";

    return "-".repeat(50) + modulesStatus + "-".repeat(50) + clientStatus;
}

async function execute(client: Client): Promise<void> {
    if (!client.user || !client.application) {
        throw new Error("No application or user for it is provided.");
    }

    console.log(generateDependencyReport());
    console.log(generateApplicationStatus(client));

    client.user.setActivity("over you", { type: ActivityType.Watching });

    const restCommands = Array.from(client.commands.values()).map((value) => value.data);

    client.application.commands.set(restCommands);
}

const name = "ready";

export { execute, name };

import { QuetzaClient } from "../../../assets/QuetzaClient";

export async function run(client: QuetzaClient, args: unknown[]): Promise<void> {
    if (!client.user)
        return;

    Object.values(client.Modules).forEach((value) => {
        console.log(`Module ${value.data.name} is active...`);
    });

    console.log(`${client.user.username} logged in as ${client.user.tag}!`);
    client.user.setActivity("on sound waves.", { type: "PLAYING" });

    let restCommands = [];

    for (const value of client.Commands.values()) {
        restCommands.push(value.data);
    }

    client.application?.commands.set(restCommands);
}


export const name = "ready";
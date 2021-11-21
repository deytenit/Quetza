import { MyClient } from "../types/MyClient";

export async function run(args: unknown[], client: MyClient): Promise<void> {
    if (!client.user)
        return;

    console.log(`${client.user.username} logged in as ${client.user.tag}!`);
    client.user.setActivity("on sound waves.", { type: "PLAYING" });
}


export const name = "ready";
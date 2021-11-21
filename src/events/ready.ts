import { MyClient } from "../types/Client";

export async function run(args: unknown[], client: MyClient): Promise<void> {
    if (!client.user)
        return;
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("on sound waves.", { type: "PLAYING" });
}


export const name = "ready";
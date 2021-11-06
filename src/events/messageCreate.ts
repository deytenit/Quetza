import { Message } from "discord.js";
import { MyClient } from "../types/Client";

export async function run(args: Message[], client: MyClient): Promise<void> {
    const [message] = args;

    if (message.guild)
        await message.guild.commands.set(client.restCommands);
}


export const name = "messageCreate";
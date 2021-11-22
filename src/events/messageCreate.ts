import { ClientApplication, Message } from "discord.js";
import { MyClient } from "../assets/MyClient";

export async function run(args: Message[], client: MyClient): Promise<void> {
    const [message] = args;

    const application = client.application as ClientApplication;

    if (application && message.author.id === client.owner) {
        switch (message.content) {
            case `!${client.user?.username}-dev-set-global-commands`: {
                application.commands.set(client.restCommands);
                await message.reply("Setting up command interactions. (It can take up to 1 hour)");
                break;
            }
            case `!${client.user?.username}-dev-kill-me`: {
                await message.channel.send("**_I never stopped smiling surrounded by the winds of death._**");
                process.exit(0);
            }
        }
    }
}

export const name = "messageCreate";
"use strict";

import { MyClient } from "./types/Client";

const token = process.env.DISCORD_TOKEN;

const client = new MyClient("./commands/", "./events");

client.on("ready", () => {
    if (!client.user)
        return;
    console.info(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("on sound waves.", { type: "PLAYING" });
});

client.on("messageCreate", async (message) => {
    if (message.guild)
        await message.guild.commands.set(client.restCommands);
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand() && client.commands.has(interaction.commandName)) {
        const command = client.commands.get(interaction.commandName);
        command.run(client, interaction);
    }
});

client.login(token);
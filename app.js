"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./types/Client");
const token = "NzIyMjE0MTA3MjM5MDIyNjcy.Xuf0TQ.R4epY00OqZSiY5zcfQ86Wo1GPg0";
const client = new Client_1.MyClient("./commands/", "./events");
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
//# sourceMappingURL=app.js.map
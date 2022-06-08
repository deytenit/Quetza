import { CommandInteraction } from "discord.js";
import Client from "../lib/Client";
import I8n from "../lib/I8n";

export async function run(client: Client, ctx: CommandInteraction) {
    const start = Date.now();

    if (!client.application) {
        await ctx.reply({ embeds: [I8n.en.ping(undefined)] });
        return;
    }

    await client.application.fetch();

    await ctx.reply({ embeds: [I8n.en.ping(Date.now() - start)] });
}

const data = {
    name: "ping",
    description: "Try to ping me.",
};

export { data };

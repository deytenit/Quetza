import { GatewayIntentBits } from "discord.js";

import config from "./config.js";
import Client from "./lib/client.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.login(config.discordToken);

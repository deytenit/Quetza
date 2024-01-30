import { GatewayIntentBits } from "discord.js";

import config from "$config.js";
import Client from "$lib/client.js";

/**
 * Ready to go bot instance.
 *
 * @remarks Quetza itself.
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.login(config.application.token);

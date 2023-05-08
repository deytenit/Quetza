import { Events, Message } from "discord.js";

import Client from "../../../lib/client.js";

async function execute(client: Client, eventee: [Message]): Promise<void> {
    const [message] = eventee;

}

const name = Events.MessageCreate;

export { execute, name };

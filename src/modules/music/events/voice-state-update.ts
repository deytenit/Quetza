import { VoiceState } from "discord.js";

import Client from "../../../lib/client.js";
import { asleep } from "../lib/misc.js";
import replies from "../lib/replies.js";
import { controller } from "../module.js";

const WAIT_TIME = 30_000;

async function execute(client: Client, eventee: [VoiceState]): Promise<void> {
    const [oldState] = eventee;

    const player = controller.get(oldState.guild);

    if (!player || !oldState.channel || !client.user) {
        return;
    }

    if (
        oldState.channel.members.size === 1 &&
        oldState.channel.members.first()?.user === client.user
    ) {
        await asleep(WAIT_TIME);
        if (
            oldState.channel.members.size === 1 &&
            oldState.channel.members.first()?.user === client.user
        ) {
            await player.channel.send(replies.alone());
            player.destroy();
        }
    }
}

const name = "voiceStateUpdate";

export { execute, name };

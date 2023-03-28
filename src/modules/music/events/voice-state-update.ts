import { VoiceState } from "discord.js";

import Client from "../../../lib/client.js";
import I18n from "../lib/i18n.js";
import { asleep } from "../lib/misc.js";
import { controller } from "../module.js";

async function execute(client: Client, eventee: VoiceState[]): Promise<void> {
    const [oldState] = eventee;

    const player = controller.get(oldState.guild.id);

    if (!player || !oldState.channel || !client.user) {
        return;
    }

    if (oldState.channel.members.filter((value) => value.user !== client.user).size === 0) {
        await asleep(30000);
        if (oldState.channel.members.filter((value) => value.user !== client.user).size === 0) {
            await player.channel.send({ embeds: [I18n.embeds.fullyAlone()] });
            player.destroy();
        }
    }
}

const name = "voiceStateUpdate";

export { execute, name };

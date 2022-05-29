import { VoiceState } from "discord.js";
import I8n from "../lib/I8n";
import Client from "../lib/Client";
import { asleep } from "../lib/Misc";

export async function run(client: Client, args: VoiceState[]): Promise<void> {
    const [oldState] = args;

    const player = client.modules.music.get(oldState.guild.id);

    if (!player || !oldState.channel || !client.user)
        return;

    if (oldState.channel.members.filter(value => value.user !== client.user).size === 0) {
        await asleep(30000);
        if (oldState.channel.members.filter(value => value.user !== client.user).size === 0) {
            await player.Channel.send({ embeds: [I8n.en.fullyAlone()] });
            player.destroy();
        }
    }
}


export const name = "voiceStateUpdate";
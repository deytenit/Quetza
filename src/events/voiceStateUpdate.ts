import { ColorResolvable, MessageEmbed, VoiceState } from "discord.js";
import { design } from "../config";
import { MyClient } from "../types/MyClient";
import { sleep } from "../types/Misc";

export async function run(args: VoiceState[], client: MyClient): Promise<void> {
    const [oldState, newState] = args;

    const player = client.players.getPlayer(newState.guild.id);

    if (!player)
        return;

    if (oldState.channel?.members.size === 1 && oldState.channel.members.first()?.id === client.user?.id) {
        await sleep(30000);
        const channel = player.channel;
        if (oldState.channel.members.size === 1)
            player.destroy();

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("I've decided to leave to conserve my energy")
            .setDescription("Since there was nobody in the voice channel.")
        await channel.send({ embeds: [embed] });
    }
}


export const name = "voiceStateUpdate";
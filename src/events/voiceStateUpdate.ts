import { ColorResolvable, MessageEmbed, VoiceState } from "discord.js";
import { design } from "../config";
import { MyClient } from "../types/Client";
import { sleep } from "../types/Misc";

export async function run(args: VoiceState[], client: MyClient): Promise<void> {
    const [oldState, newState] = args;

    const player = client.players.getPlayer(newState.guild.id);

    if (!player)
        return;

    if (newState.id === client.user?.id && newState.deaf === false) {
        newState.setDeaf(true);

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle("Please do not undeafen me.")
            .setDescription("It's for your own privacy, trust me.")
        await player.channel.send({ embeds: [embed] });
    }

    if (newState.channel?.members.size === 1 && newState.channel.members.first()) {
        await sleep(30000);
        if (newState.channel.members.first()?.id === client.user?.id)
            player.destroy();
    }
}


export const name = "voiceStateUpdate";
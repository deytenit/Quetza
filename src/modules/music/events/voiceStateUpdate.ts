import { ColorResolvable, MessageEmbed, VoiceState } from "discord.js";
import { quetzaConfig } from "../../../config";
import { QuetzaClient } from "../../../assets/QuetzaClient";
import { asleep } from "../assets/Misc";

export async function run(client: QuetzaClient, args: VoiceState[]): Promise<void> {
    const [oldState, newState] = args;

    const player = client.Modules["music"].control.getPlayer(newState.guild.id);

    if (!player)
        return;

    if (oldState.channel?.members.size === 1 && oldState.channel.members.first()?.id === client.user?.id) {
        await asleep(30000);
        const channel = player.Channel;
        if (oldState.channel.members.size === 1) {
            const embed = new MessageEmbed()
                .setColor(quetzaConfig.color as ColorResolvable)
                .setTitle("I've decided to leave to conserve my energy")
                .setDescription("Since there was nobody in the voice channel.")
            await channel.send({ embeds: [embed] });
            player.destroy();
        }
    }
}


export const name = "voiceStateUpdate";
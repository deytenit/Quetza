/**
 * voiceStateUpdate
 *
 * Monitors voice states of attended guilds.
 * If Quetza happens to be alone in the Voice Channel - destroys guilds player and disconnects.
 *
 * @packageDocumentation
 */

import { BaseGuildVoiceChannel, User, VoiceState } from "discord.js";

import Client from "$lib/client.js";
import Music from "$mlib/music.js";

import { asleep } from "../lib/misc.js";
import replies from "../lib/replies.js";

/** Amount of time Quetza can be alone in voice channel. */
const TIME_TILL_DISCONNECT = 30_000;

/**
 * Deduct {@link BaseGuildVoiceChannel} user is a member of.
 *
 * @returns BaseGuildVoiceChannel user is a member of, null if not a member of any.
 *
 * @param user - User that might be in one of a channels.
 * @param channels - List of channels that might have user as it member.
 *
 * @internal
 */
function resolveVoiceChannel(
    user: User,
    ...channels: (BaseGuildVoiceChannel | null)[]
): BaseGuildVoiceChannel | null {
    return (
        channels.find((channel) => channel?.members.some((member) => member.user === user)) ?? null
    );
}

async function execute(
    client: Client<true>,
    eventee: [VoiceState, VoiceState],
    controller: Music
): Promise<void> {
    const [oldState, newState] = eventee;

    const player = controller.get(oldState.guild);

    const channel = resolveVoiceChannel(client.user, oldState.channel, newState.channel);

    if (!player || !channel) {
        return;
    }

    if (channel.members.size === 1) {
        await asleep(TIME_TILL_DISCONNECT);
        if (channel.members.size === 1 && channel.members.first()?.user === client.user) {
            await player.channel.send(replies.alone());
            player.destroy();
        }
    }
}

const name = "voiceStateUpdate";

export { execute, name };

import { MessageEmbed } from "discord.js";
import Player from "./Player";
import { loopOption, track } from "./Types";
import { loopMoji, secToISO, statusBarGenerator, volumeMoji } from "./Misc";
import Queue from "./Queue";
import { AudioResource } from "@discordjs/voice";

export default class I8n {
    public static en = {
        nowPlaying: (track: track) => {
            return new MessageEmbed()
                .setColor("LUMINOUS_VIVID_PINK")
                .setAuthor({
                    iconURL: track.requester.avatarURL() || undefined,
                    name: track.requester.tag,
                })
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("**playing now.**")
                .setThumbnail(track.thumbnail);
        },
        cleared: (amount: number) => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle(
                    `**♻️ ${amount} tracks have been cleared from the queue.**`
                )
                .setTimestamp(new Date());
        },
        okConnected: (channel: string) => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`**✅  Successfuly connected to:** _${channel}_.`);
        },
        notConnected: () => {
            return new MessageEmbed()
                .setColor("RED")
                .setTitle(
                    "**🚫  Make yourself connected to a voice channel beforehand.**"
                );
        },
        wasConnected: () => {
            return new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("**⚠️  Already connected to a voice channel.**");
        },
        filtered: (filter?: string) => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle(filter ? `**✅  ${filter} was applied to the player.**` : "**✅  All filters were declined.**");
        },
        appended: (track?: track) => {
            return !track
                ? new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**🚫  Could not add track to the queue.**")
                : new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(track.title)
                    .setURL(track.url)
                    .setThumbnail(track.thumbnail)
                    .setAuthor({
                        iconURL: track.requester.avatarURL() || undefined,
                        name: track.requester.tag,
                    })
                    .setDescription("**has been added to the queue.**")
                    .setTimestamp(new Date());
        },
        jumped: (state: boolean) => {
            return state
                ? new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("_**Perfoming jump.**_")
                : new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**❗  Bad _jump_ request.**");
        },
        looped: (query: loopOption) => {
            switch (query) {
            case "AUTO": {
                return new MessageEmbed()
                    .setColor("LUMINOUS_VIVID_PINK")
                    .setTitle(
                        "**🔀  Shuffle mode** _(does not affect the queue order)_."
                    );
            }
            case "LOOP": {
                return new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("**🔁  Looping over the queue.**");
            }
            case "NONE": {
                return new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**⤵️  Player will stop on the queue end.**");
            }
            case "SONG": {
                return new MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle("**🔂  Looping a single track.**");
            }
            }
        },
        skipped: () => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**⏭️  Skipping.**");
        },
        paused: (state: boolean) => {
            return state
                ? new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("_**▶️  Resumed.**_")
                : new MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle("_**⏸️  Paused.**_");
        },
        removed: (track?: track) => {
            return track
                ? new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(track.title)
                    .setDescription("**was removed from the queue.**")
                    .setTimestamp(new Date())
                    .setURL(track.url)
                    .setThumbnail(track.thumbnail)
                : new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**❗  Bad _remove_ request.**");
        },
        fastForwarded: (amount: number) => {
            return new MessageEmbed()
                .setColor("BLUE")
                .setTitle(
                    `**⏩  Fast-forwarding to ${secToISO(
                        amount
                    )}**`
                );
        },
        destroyed: () => {
            return new MessageEmbed()
                .setColor("RED")
                .setTitle("**💀  Destroying the player.**");
        },
        volumeSet: (amount: number) => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`**${volumeMoji(amount)} Volume has been set to ${amount}%**`);
        },
        queueEmpty: () => {
            return new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("**❎  Queue is empty.**");
        },
        playerInfo: (player?: Player) => {
            if (!player)
                return new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**🚫  Player does not exist.**");

            if (player.Resource) {
                return new MessageEmbed()
                    .setColor("LUMINOUS_VIVID_PINK")
                    .setTitle(
                        `${player.Queue.Position + 1}. ${player.Resource.metadata.title}`
                    )
                    .setDescription(
                        statusBarGenerator(
                            player.Resource.playbackDuration / 1000,
                            player.Resource.metadata.duration
                        )
                    )
                    .setThumbnail(player.Resource.metadata.thumbnail)
                    .setURL(player.Resource.metadata.url)
                    .addFields([
                        {
                            name: "Applied Filters",
                            value:
                                player.Filter.Filters.map(
                                    (value) => value[0]
                                ).join("\n") + "\ndefault",
                            inline: true,
                        },
                        {
                            name: "Queue Length",
                            value: `🔢 ${player.Queue.Tracks.length}`,
                            inline: true,
                        },
                        {
                            name: "Queue Duration",
                            value: `💿 ${secToISO(player.Queue.Duration)}`,
                            inline: true,
                        },
                        {
                            name: "Queue Looping",
                            value: `${loopMoji(player.Queue.Loop)} ${player.Queue.Loop}`,
                            inline: true,
                        },
                        {
                            name: "Volume amount",
                            value: `${volumeMoji(player.Volume)} ${player.Volume}/150`,
                            inline: true,
                        },
                        {
                            name: "Player lifetime",
                            value: `🕓 ${secToISO((Date.now() - player.Created.getTime()) / 1000)}`,
                            inline: true,
                        },
                    ]);
            } else {
                return new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("💿  Insert the disk...")
                    .setDescription(statusBarGenerator(0, 0))
                    .setURL(
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
                    )
                    .addFields([
                        {
                            name: "Applied Filters",
                            value:
                                player.Filter.Filters.map(
                                    (value) => value[0]
                                ).join("\n") + "\ndefault",
                            inline: true,
                        },
                        {
                            name: "Queue Length",
                            value: `🔢 ${player.Queue.Tracks.length}`,
                            inline: true,
                        },
                        {
                            name: "Queue Duration",
                            value: `💿 ${secToISO(player.Queue.Duration)}`,
                            inline: true,
                        },
                        {
                            name: "Queue Looping",
                            value: `${loopMoji(player.Queue.Loop)} ${player.Queue.Loop}`,
                            inline: true,
                        },
                        {
                            name: "Volume amount",
                            value: `${volumeMoji(player.Volume)} ${player.Volume}/150`,
                            inline: true,
                        },
                        {
                            name: "Player lifetime",
                            value: `🕓 ${secToISO((Date.now() - player.Created.getTime()) / 1000)}`,
                            inline: true,
                        },
                    ]);
            }
        },
        queueDesigner: (
            queue: Queue,
            page: number,
            resource: AudioResource<track> | undefined
        ) => {
            page = Math.max(
                0,
                Math.min(Math.floor(queue.Tracks.length / 11), page)
            );

            return new MessageEmbed()
                .setColor("LUMINOUS_VIVID_PINK")
                .setTitle(
                    resource
                        ? `${queue.Position + 1}. ${resource.metadata.title}`
                        : "💿  Insert the disk..."
                )
                .setURL(
                    resource
                        ? resource.metadata.url
                        : "https://www.youtube.com/watch?v=5mGuCdlCcNM&ab_channel=Ra%C3%BAlBlanco"
                )
                .setThumbnail(
                    resource
                        ? resource.metadata.thumbnail
                        : "https/img.youtube.com/vi/5mGuCdlCcNM/default.jpg"
                )
                .setDescription(
                    resource
                        ? statusBarGenerator(
                            resource.playbackDuration / 1000,
                            resource.metadata.duration
                        )
                        : statusBarGenerator(0, 0)
                )
                .setFields(
                    queue.Tracks.slice(page * 10, page * 10 + 10).map(
                        (value, index) => {
                            return {
                                name: `${
                                    page * 10 + index + 1
                                }. ${value.title.padEnd(35)}`,
                                value: `**[${secToISO(value.duration)}]**`,
                            };
                        }
                    )
                );
        },
        fullyAlone: () => {
            return new MessageEmbed()
                .setColor("LUMINOUS_VIVID_PINK")
                .setTitle("🥬  I have decided to leave to conserve my energy.")
                .setDescription(
                    "_**Since there was nobody in the voice channel.**_"
                );
        },
        reshuffle: () => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**✅  Successfuly reshuffled queue.**");
        },
        savedQueue: (title: string) => {
            return new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`**✅  Successfuly saved ${title} to the server's storage.**`);
        },
        savedExceed: (title: string) => {
            return new MessageEmbed()
                .setColor("RED")
                .setTitle(`**🚫  Could not save ${title} to the storage.**`)
                .setDescription("_**Delete your old one beforehand...**_");
        },
        ping: (ping?: number) => {
            const title = ping ? `I have pinged ${ping} ms late.` : "There is no application.";

            const comment = !ping ? "How am I speaking then?" : ping > 250 ? "I'm kinda slowpoke ngl." :
                ping > 200 ? "I can do better than this." :
                    "Dream's speed!";

            return new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`**${title}**`)
                .setDescription(`_**${comment}**_`);
        }
    };
}

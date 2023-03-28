import { AudioResource } from "@discordjs/voice";
import { EmbedBuilder } from "discord.js";

import { loopMoji, secToISO, statusBarGenerator, volumeMoji } from "./misc.js";
import Player from "./player.js";
import Queue from "./queue.js";
import { LoopOption, Track } from "./types.js";

export default class I18n {
    public static readonly embeds = {
        nowPlaying: (track: Track) =>
            new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setAuthor({
                    iconURL: track.requester.avatarURL() || undefined,
                    name: track.requester.tag
                })
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("**playing now.**")
                .setThumbnail(track.thumbnail),
        cleared: (amount: number) =>
            new EmbedBuilder()
                .setColor("Green")
                .setTitle(`**♻️ ${amount} tracks have been cleared from the queue.**`)
                .setTimestamp(new Date()),
        okConnected: (channel: string) =>
            new EmbedBuilder()
                .setColor("Green")
                .setTitle(`**✅  Successfuly connected to:** _${channel}_.`),
        notConnected: () =>
            new EmbedBuilder()
                .setColor("Red")
                .setTitle("**🚫  Make yourself connected to a voice channel beforehand.**"),
        wasConnected: () =>
            new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("**⚠️  Already connected to a voice channel.**"),
        filtered: (filter?: string) =>
            new EmbedBuilder()
                .setColor("Green")
                .setTitle(
                    filter
                        ? `**✅  ${filter} was applied to the player.**`
                        : "**✅  All filters were declined.**"
                ),
        appended: (track?: Track) =>
            !track
                ? new EmbedBuilder()
                      .setColor("Red")
                      .setTitle("**🚫  Could not add track to the queue.**")
                : new EmbedBuilder()
                      .setColor("Green")
                      .setTitle(track.title)
                      .setURL(track.url)
                      .setThumbnail(track.thumbnail)
                      .setAuthor({
                          iconURL: track.requester.avatarURL() || undefined,
                          name: track.requester.tag
                      })
                      .setDescription("**has been added to the queue.**")
                      .setTimestamp(new Date()),
        jumped: (state: boolean) =>
            state
                ? new EmbedBuilder().setColor("Green").setTitle("_**Perfoming jump.**_")
                : new EmbedBuilder().setColor("Red").setTitle("**❗  Bad _jump_ request.**"),
        looped: (query: LoopOption) => {
            switch (query) {
                case "AUTO": {
                    return new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setTitle("**🔀  Shuffle mode** _(does not affect the queue order)_.");
                }
                case "LOOP": {
                    return new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("**🔁  Looping over the queue.**");
                }
                case "NONE": {
                    return new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("**⤵️  Player will stop on the queue end.**");
                }
                case "SONG": {
                    return new EmbedBuilder()
                        .setColor("Yellow")
                        .setTitle("**🔂  Looping a single track.**");
                }
            }
        },
        skipped: () => new EmbedBuilder().setColor("Green").setTitle("**⏭️  Skipping.**"),
        paused: (state: boolean) =>
            state
                ? new EmbedBuilder().setColor("Green").setTitle("_**▶️  Resumed.**_")
                : new EmbedBuilder().setColor("Yellow").setTitle("_**⏸️  Paused.**_"),
        removed: (track?: Track) =>
            track
                ? new EmbedBuilder()
                      .setColor("Green")
                      .setTitle(track.title)
                      .setDescription("**was removed from the queue.**")
                      .setTimestamp(new Date())
                      .setURL(track.url)
                      .setThumbnail(track.thumbnail)
                : new EmbedBuilder().setColor("Red").setTitle("**❗  Bad _remove_ request.**"),
        fastForwarded: (amount: number) =>
            new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`**⏩  Fast-forwarding to ${secToISO(amount)}**`),
        destroyed: () =>
            new EmbedBuilder().setColor("Red").setTitle("**💀  Destroying the player.**"),
        volumeSet: (amount: number) =>
            new EmbedBuilder()
                .setColor("Green")
                .setTitle(`**${volumeMoji(amount)} Volume has been set to ${amount}%**`),
        queueEmpty: () => new EmbedBuilder().setColor("Yellow").setTitle("**❎  Queue is empty.**"),
        playerInfo: (player?: Player) => {
            if (!player) {
                return new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("**🚫  Player does not exist.**");
            }

            if (player.resource) {
                return new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle(`${player.queue.position + 1}. ${player.resource.metadata.title}`)
                    .setDescription(
                        statusBarGenerator(
                            player.resource.playbackDuration / 1000,
                            player.resource.metadata.duration
                        )
                    )
                    .setThumbnail(player.resource.metadata.thumbnail)
                    .setURL(player.resource.metadata.url)
                    .addFields([
                        {
                            name: "Applied Filters",
                            value:
                                player.filter
                                    .toggled()
                                    .map((value) => value[0])
                                    .join("\n") + "\ndefault",
                            inline: true
                        },
                        {
                            name: "Queue Length",
                            value: `🔢 ${player.queue.tracks.length}`,
                            inline: true
                        },
                        {
                            name: "Queue Duration",
                            value: `💿 ${secToISO(player.queue.duration)}`,
                            inline: true
                        },
                        {
                            name: "Queue Looping",
                            value: `${loopMoji(player.queue.loop)} ${player.queue.loop}`,
                            inline: true
                        },
                        {
                            name: "Volume amount",
                            value: `${volumeMoji(player.volume)} ${player.volume}/150`,
                            inline: true
                        },
                        {
                            name: "Player lifetime",
                            value: `🕓 ${secToISO((Date.now() - player.created.getTime()) / 1000)}`,
                            inline: true
                        }
                    ]);
            } else {
                return new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("💿  Insert the disk...")
                    .setDescription(statusBarGenerator(0, 0))
                    .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley")
                    .addFields([
                        {
                            name: "Applied Filters",
                            value:
                                player.filter
                                    .toggled()
                                    .map((value) => value[0])
                                    .join("\n") + "\ndefault",
                            inline: true
                        },
                        {
                            name: "Queue Length",
                            value: `🔢 ${player.queue.tracks.length}`,
                            inline: true
                        },
                        {
                            name: "Queue Duration",
                            value: `💿 ${secToISO(player.queue.duration)}`,
                            inline: true
                        },
                        {
                            name: "Queue Looping",
                            value: `${loopMoji(player.queue.loop)} ${player.queue.loop}`,
                            inline: true
                        },
                        {
                            name: "Volume amount",
                            value: `${volumeMoji(player.volume)} ${player.volume}/150`,
                            inline: true
                        },
                        {
                            name: "Player lifetime",
                            value: `🕓 ${secToISO((Date.now() - player.created.getTime()) / 1000)}`,
                            inline: true
                        }
                    ]);
            }
        },
        queueDesigner: (queue: Queue, page: number, resource: AudioResource<Track> | undefined) => {
            page = Math.max(0, Math.min(Math.floor(queue.tracks.length / 11), page));

            return new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTitle(
                    resource
                        ? `${queue.position + 1}. ${resource.metadata.title}`
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
                    queue.tracks.slice(page * 10, page * 10 + 10).map((value, index) => ({
                        name: `${page * 10 + index + 1}. ${value.title.padEnd(35)}`,
                        value: `**[${secToISO(value.duration)}]**`
                    }))
                );
        },
        fullyAlone: () =>
            new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTitle("🥬  I have decided to leave to conserve my energy.")
                .setDescription("_**Since there was nobody in the voice channel.**_"),
        reshuffle: () =>
            new EmbedBuilder().setColor("Green").setTitle("**✅  Successfuly reshuffled queue.**")
    };
}

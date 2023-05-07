import { AudioResource } from "@discordjs/voice";
import { BaseMessageOptions, EmbedBuilder, italic, time, underscore } from "discord.js";

import { loopMoji, statusBarGenerator, volumeMoji } from "./misc.js";
import Player from "./player.js";
import Queue from "./queue.js";
import { LoopOption, Track } from "./types.js";

const replies = {
    notExists: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⚠️  Command ignored - player does not exist")
            .setDescription("Use '/play' to create a new one.");

        return { embeds: [embed] };
    },
    notPlaying: () => {
        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setTitle("💿  Insert the disk...")
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            .setDescription("Use '/play' to start the playback.");

        return { embeds: [embed] };
    },
    nowPlaying: (track: Track): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setAuthor({
                iconURL: track.requester.avatarURL() ?? undefined,
                name: track.requester.tag
            })
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription("playing now.")
            .setThumbnail(track.thumbnail);

        return { embeds: [embed] };
    },
    okConnected: (channel: string): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`✅  Successfuly connected to: ${italic(channel)}`)
            .setDescription("Will leave after some time, if left alone.");

        return { embeds: [embed] };
    },
    notConnected: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❗  Cannot create new player.")
            .setDescription("Make yourself connected to a voice channel beforehand.");

        return { embeds: [embed] };
    },
    isConnected: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⚠️  Player already exists")
            .setDescription("No need in creating a new one.");

        return { embeds: [embed] };
    },
    destroyed: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("💀  Destroying the player")
            .setDescription("Everything is lost now. Use '/play' to create a new one.");

        return { embeds: [embed] };
    },
    alone: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setTitle("🥬  I have decided to leave to conserve my energy")
            .setDescription("Since there was nobody in the voice channel.");

        return { embeds: [embed] };
    },
    paused: (state: boolean): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (state) {
            embed = new EmbedBuilder().setColor("Green").setTitle("▶️  The playback was resumed");
        } else {
            embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("⏸️  The playback was paused")
                .setDescription("Invoke this command again to resume.");
        }

        return { embeds: [embed] };
    },
    seeked: (from: number, to: number): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (from < to) {
            embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⏩  Fast-forwarding by ${time(to - from, "T")}`);
        } else {
            embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⏪  Fast-reversing by ${time(from - to, "T")}`);
        }

        embed.setDescription(
            `Moving playback from ${italic(time(from, "T"))} to ${italic(time(to, "T"))}.`
        );

        return { embeds: [embed] };
    },
    looped: (option: LoopOption) => {
        let embed: EmbedBuilder;

        switch (option) {
            case "AUTO": {
                embed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle(`${loopMoji(option)}  Shuffle mode.`)
                    .setDescription("Does not affect the queue order. Endless playback.");

                break;
            }
            case "LOOP": {
                embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`${loopMoji(option)}  Looping over the queue.`)
                    .setDescription("Will start over after final track. Endless playback.");

                break;
            }
            case "SONG": {
                embed = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle(`${loopMoji(option)}  Looping a single track.`)
                    .setDescription("Endless playback of a single track. Over and over again...");

                break;
            }
            case "NONE": {
                embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`${loopMoji(option)}  Drop on final.`)
                    .setDescription(
                        "Will end playback after final track. Action will be needed to continue."
                    );

                break;
            }
        }

        return { embeds: [embed] };
    },
    reshuffle: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅  Successfuly reshuffled queue")
            .setDescription("Use 'random' mode, if you want shuffle without reshuffle.");

        return { embeds: [embed] };
    },
    skipped: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("⏭️  Skipping current track")
            .setDescription("Behavior depends on the loop option.");

        return { embeds: [embed] };
    },
    jumped: (from: number, to?: number): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (!to) {
            embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❗  Cannot perfome jump over the queue")
                .setDescription("Either not found by query, or index is not in range.");
        } else {
            embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`✅  Jumping over the queue`)
                .setDescription(
                    `Switching from #${italic(from.toString())} to #${italic(to.toString())}.`
                );
        }

        return { embeds: [embed] };
    },
    appended: (track?: Track): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (!track) {
            embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❗  Cannot add track to the queue")
                .setDescription("Either not found by query, or URL is broken.");
        } else {
            embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({
                    iconURL: track.requester.avatarURL() ?? undefined,
                    name: track.requester.tag
                })
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("has been added to the queue.")
                .setThumbnail(track.thumbnail)
                .setTimestamp();
        }

        return { embeds: [embed] };
    },
    removed: (track?: Track): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (!track) {
            embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("**❗  Cannot delete track from queue")
                .setDescription("Either not found by query, or index is not in range.");
        } else {
            embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("was removed from the queue.")
                .setThumbnail(track.thumbnail)
                .setTimestamp();
        }

        return { embeds: [embed] };
    },
    cleared: (amount: number): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`♻️  Queue has been cleared`)
            .setDescription(
                `${underscore(amount.toString())} track${amount > 1 ? "s were" : " was"} deleted.`
            );

        return { embeds: [embed] };
    },
    filtered: (filter?: string): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (filter) {
            embed = new EmbedBuilder().setTitle(
                `✅  ${italic(filter)} was applied to the playback`
            );
        } else {
            embed = new EmbedBuilder().setTitle("♻️  All filters were declined");
        }

        embed.setColor("Green");

        return { embeds: [embed] };
    },
    volumeSet: (amount: number): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${volumeMoji(amount)}  Volume has been set to ${amount}%**`)
            .setDescription("This will affect everyone listening.");

        return { embeds: [embed] };
    },
    queue: (queue: Queue, position = 0, resource?: AudioResource<Track>): BaseMessageOptions => {
        if (queue.empty()) {
            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("⚠️  Queue is empty")
                .setDescription("Use '/play' to add some tracks.");

            return { embeds: [embed] };
        }

        let embed: EmbedBuilder;

        if (!resource) {
            embed = new EmbedBuilder()
                .setTitle("💿  Insert the disk...")
                .setURL("https://www.youtube.com/watch?v=5mGuCdlCcNM&ab_channel=Ra%C3%BAlBlanco")
                .setDescription(statusBarGenerator(0, 0))
                .setThumbnail("https://img.youtube.com/vi/5mGuCdlCcNM/default.jpg");
        } else {
            embed = new EmbedBuilder()
                .setTitle(`${queue.position + 1}. ${resource.metadata.title}`)
                .setURL(resource.metadata.url)
                .setDescription(
                    statusBarGenerator(resource.playbackDuration / 1000, resource.metadata.duration)
                )
                .setThumbnail(resource.metadata.thumbnail);
        }

        embed.setColor("LuminousVividPink").setFields(
            queue.tracks.slice(position, position + 10).map((value, index) => ({
                name: `${position + index + 1}. ${value.title.padEnd(35)}`,
                value: `[${time(value.duration, "T")}]`
            }))
        );

        return { embeds: [embed] };
    },
    info: (player: Player): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (player.resource) {
            embed = new EmbedBuilder()
                .setTitle(`${player.queue.position + 1}. ${player.resource.metadata.title}`)
                .setURL(player.resource.metadata.url)
                .setDescription(
                    statusBarGenerator(
                        player.resource.playbackDuration / 1000,
                        player.resource.metadata.duration
                    )
                )
                .setThumbnail(player.resource.metadata.thumbnail);
        } else {
            embed = new EmbedBuilder()
                .setTitle("💿  Insert the disk...")
                .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                .setDescription(statusBarGenerator(0, 0));
        }

        embed.setColor("LuminousVividPink").addFields([
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
                value: `💿 ${time(player.queue.duration, "T")}`,
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
                value: `🕓 ${time((Date.now() - player.createdAt.getTime()) / 1000, "T")}`,
                inline: true
            }
        ]);

        return { embeds: [embed] };
    }
};

export default replies;

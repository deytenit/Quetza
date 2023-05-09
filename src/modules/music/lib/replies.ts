import { AudioResource } from "@discordjs/voice";
import { BaseMessageOptions, EmbedBuilder, italic } from "discord.js";

import config from "../../../config.js";
import { loopMoji, statusBarGenerator, toISOTime, volumeMoji } from "./misc.js";
import Player from "./player.js";
import Queue from "./queue.js";
import { LoopOption, Track } from "./types.js";

const replies = {
    notExists: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.warning)
            .setTitle("⚠️  Command ignored - player does not exist")
            .setDescription("Use '/play' to create a new one.");

        return { embeds: [embed] };
    },
    searching: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle("🔍  Searching...")
            .setDescription("It will take longer if playlist or non-youtube URL was queried.");

        return { embeds: [embed] };
    },
    notPlaying: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle("💿  Insert the disk...")
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            .setDescription("Use '/play' to start the playback.");

        return { embeds: [embed] };
    },
    nowPlaying: (track: Track): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
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
            .setColor(config.colors.success)
            .setTitle(`✅  Successfuly connected to: ${italic(channel)}`)
            .setDescription("Will leave after some time, if left alone.");

        return { embeds: [embed] };
    },
    notConnected: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle("❗  Cannot create new player.")
            .setDescription("Make yourself connected to a voice channel beforehand.");

        return { embeds: [embed] };
    },
    destroyed: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle("💀  Destroying the player")
            .setDescription("Everything is lost now. Use '/play' to create a new one.");

        return { embeds: [embed] };
    },
    alone: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle("🥬  I have decided to leave to conserve my energy")
            .setDescription("Since there was nobody in the voice channel.");

        return { embeds: [embed] };
    },
    paused: (state: boolean): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (state) {
            embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle("▶️  The playback was resumed");
        } else {
            embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle("⏸️  The playback was paused")
                .setDescription("Invoke this command again to resume.");
        }

        return { embeds: [embed] };
    },
    seeked: (from: number, to: number): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (from < to) {
            embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle(`⏩  Fast-forwarding by ${toISOTime(to - from)}`);
        } else {
            embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle(`⏪  Fast-reversing by ${toISOTime(from - to)}`);
        }

        embed.setDescription(
            `Moving playback from ${italic(toISOTime(from))} to ${italic(toISOTime(to))}.`
        );

        return { embeds: [embed] };
    },
    looped: (option: LoopOption) => {
        let embed: EmbedBuilder;

        switch (option) {
            case "AUTO": {
                embed = new EmbedBuilder()
                    .setColor(config.colors.default)
                    .setTitle(`${loopMoji(option)}  Shuffle mode.`)
                    .setDescription("Does not affect the queue order. Endless playback.");

                break;
            }
            case "LOOP": {
                embed = new EmbedBuilder()
                    .setColor(config.colors.info)
                    .setTitle(`${loopMoji(option)}  Looping over the queue.`)
                    .setDescription("Will start over after final track. Endless playback.");

                break;
            }
            case "SONG": {
                embed = new EmbedBuilder()
                    .setColor(config.colors.warning)
                    .setTitle(`${loopMoji(option)}  Looping a single track.`)
                    .setDescription("Endless playback of a single track. Over and over again...");

                break;
            }
            case "NONE": {
                embed = new EmbedBuilder()
                    .setColor(config.colors.error)
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
            .setColor(config.colors.success)
            .setTitle("✅  Successfuly reshuffled queue")
            .setDescription("Use 'random' mode, if you want shuffle without reshuffle.");

        return { embeds: [embed] };
    },
    skipped: (): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle("⏭️  Skipping current track")
            .setDescription("Behavior depends on the loop option.");

        return { embeds: [embed] };
    },
    jumped: (previous?: Track, to?: number): BaseMessageOptions => {
        if (!to) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❗  Cannot perfome jump over the queue")
                .setDescription("Either not found by query, or index is not in range.");

            return { embeds: [embed] };
        }

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`✅  Jumping over the queue`);

        if (previous) {
            embed.setDescription(`Switching from ${italic(previous.title)}.`);
        } else {
            embed.setDescription("Playback will start again.");
        }

        return { embeds: [embed] };
    },
    appended: (track?: Track): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (track) {
            embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setAuthor({
                    iconURL: track.requester.avatarURL() ?? undefined,
                    name: track.requester.tag
                })
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("has been added to the queue.")
                .setThumbnail(track.thumbnail)
                .setTimestamp();
        } else {
            embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❗  Cannot add track to the queue")
                .setDescription("Either not found by query, or URL is broken.");
        }

        return { embeds: [embed] };
    },
    removed: (track?: Track): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (track) {
            embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(track.title)
                .setURL(track.url)
                .setDescription("was removed from the queue.")
                .setThumbnail(track.thumbnail)
                .setTimestamp();
        } else {
            embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❗  Cannot delete track from queue")
                .setDescription("Either not found by query, or index is not in range.");
        }

        return { embeds: [embed] };
    },
    cleared: (amount: number): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`♻️  Queue has been cleared`)
            .setDescription(
                `${italic(amount.toString())} track${amount > 1 ? "s were" : " was"} deleted.`
            );

        return { embeds: [embed] };
    },
    filtered: (filter?: string, status = true): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (filter) {
            embed = new EmbedBuilder().setTitle(
                `✅  ${italic(filter)} was ${status ? "applied to the playback" : "declined"}.`
            );
        } else {
            embed = new EmbedBuilder().setTitle("♻️  All filters were declined");
        }

        embed
            .setColor(config.colors.success)
            .setDescription("Playback can experience some lags during intial transformation.");

        return { embeds: [embed] };
    },
    volumeSet: (amount: number): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`${volumeMoji(amount)}  Volume has been set to ${amount}%`)
            .setDescription("This will affect everyone listening.");

        return { embeds: [embed] };
    },
    queue: (queue: Queue, position = 0, resource?: AudioResource<Track>): BaseMessageOptions => {
        if (queue.empty()) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle("⚠️  Queue is empty")
                .setDescription("Use '/play' to add some tracks.");

            return { embeds: [embed] };
        }

        let embed: EmbedBuilder;

        if (resource) {
            embed = new EmbedBuilder()
                .setTitle(`${queue.position + 1}. ${resource.metadata.title}`)
                .setAuthor({
                    iconURL: resource.metadata.requester.avatarURL() ?? undefined,
                    name: resource.metadata.requester.tag
                })
                .setURL(resource.metadata.url)
                .setDescription(statusBarGenerator(resource))
                .setThumbnail(resource.metadata.thumbnail);
        } else {
            embed = new EmbedBuilder()
                .setTitle("💿  Insert the disk...")
                .setURL("https://www.youtube.com/watch?v=5mGuCdlCcNM&ab_channel=Ra%C3%BAlBlanco")
                .setDescription(statusBarGenerator())
                .setThumbnail("https://img.youtube.com/vi/5mGuCdlCcNM/default.jpg");
        }

        embed.setColor(config.colors.info).setFields(
            queue.tracks.slice(position, position + 10).map((value, index) => ({
                name: `${position + index + 1}. ${value.title.padEnd(35)}`,
                value: `[${toISOTime(value.duration)}] | ${value.requester.tag}`
            }))
        );

        return { embeds: [embed] };
    },
    info: (player: Player): BaseMessageOptions => {
        let embed: EmbedBuilder;

        if (player.resource) {
            embed = new EmbedBuilder()
                .setTitle(`${player.queue.position + 1}. ${player.resource.metadata.title}`)
                .setAuthor({
                    iconURL: player.resource.metadata.requester.avatarURL() ?? undefined,
                    name: player.resource.metadata.requester.tag
                })
                .setURL(player.resource.metadata.url)
                .setDescription(statusBarGenerator(player.resource))
                .setThumbnail(player.resource.metadata.thumbnail);
        } else {
            embed = new EmbedBuilder()
                .setTitle("💿  Insert the disk...")
                .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                .setDescription(statusBarGenerator());
        }

        embed.setColor(config.colors.info).addFields([
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
                value: `💿 ${toISOTime(player.queue.duration)}`,
                inline: true
            },
            {
                name: "Queue Looping",
                value: `${loopMoji(player.queue.loop)} ${player.queue.loop}`,
                inline: true
            },
            {
                name: "Volume Amount",
                value: `${volumeMoji(player.volume)} ${player.volume}/150`,
                inline: true
            },
            {
                name: "Player Lifetime",
                value: `🕓 ${toISOTime((Date.now() - player.createdAt.getTime()) / 1000)}`,
                inline: true
            }
        ]);

        return { embeds: [embed] };
    }
};

export default replies;

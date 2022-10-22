import Player from "./Player";
import { loopOption, track } from "./Types";
import { loopMoji, secToISO, statusBarGenerator, volumeMoji } from "./Misc";
import Queue from "./Queue";
import { AudioResource } from "@discordjs/voice";
import { EmbedBuilder } from "discord.js";

export default class I18n {
    public static en = {
        nowPlaying: (track: track) => new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setAuthor({
                iconURL: track.requester.avatarURL() || undefined,
                name: track.requester.tag,
            })
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription("**playing now.**")
            .setThumbnail(track.thumbnail),
        cleared: (amount: number) => new EmbedBuilder()
            .setColor("Green")
            .setTitle(
                `**♻️ ${amount} tracks have been cleared from the queue.**`
            )
            .setTimestamp(new Date()),
        okConnected: (channel: string) => new EmbedBuilder()
            .setColor("Green")
            .setTitle(`**✅  Successfuly connected to:** _${channel}_.`),
        notConnected: () => new EmbedBuilder()
            .setColor("Red")
            .setTitle(
                "**🚫  Make yourself connected to a voice channel beforehand.**"
            ),
        wasConnected: () => new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("**⚠️  Already connected to a voice channel.**"),
        filtered: (filter?: string) => new EmbedBuilder()
            .setColor("Green")
            .setTitle(filter ? `**✅  ${filter} was applied to the player.**` : "**✅  All filters were declined.**"),
        appended: (track?: track) => !track
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
                    name: track.requester.tag,
                })
                .setDescription("**has been added to the queue.**")
                .setTimestamp(new Date()),
        jumped: (state: boolean) => state
            ? new EmbedBuilder()
                .setColor("Green")
                .setTitle("_**Perfoming jump.**_")
            : new EmbedBuilder()
                .setColor("Red")
                .setTitle("**❗  Bad _jump_ request.**"),
        looped: (query: loopOption) => {
            switch (query) {
            case "AUTO": {
                return new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle(
                        "**🔀  Shuffle mode** _(does not affect the queue order)_."
                    );
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
        skipped: () => new EmbedBuilder()
            .setColor("Green")
            .setTitle("**⏭️  Skipping.**"),
        paused: (state: boolean) => state
            ? new EmbedBuilder()
                .setColor("Green")
                .setTitle("_**▶️  Resumed.**_")
            : new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("_**⏸️  Paused.**_"),
        removed: (track?: track) => track
            ? new EmbedBuilder()
                .setColor("Green")
                .setTitle(track.title)
                .setDescription("**was removed from the queue.**")
                .setTimestamp(new Date())
                .setURL(track.url)
                .setThumbnail(track.thumbnail)
            : new EmbedBuilder()
                .setColor("Red")
                .setTitle("**❗  Bad _remove_ request.**"),
        fastForwarded: (amount: number) => new EmbedBuilder()
            .setColor("Blue")
            .setTitle(
                `**⏩  Fast-forwarding to ${secToISO(
                    amount
                )}**`
            ),
        destroyed: () => new EmbedBuilder()
            .setColor("Red")
            .setTitle("**💀  Destroying the player.**"),
        volumeSet: (amount: number) => new EmbedBuilder()
            .setColor("Green")
            .setTitle(`**${volumeMoji(amount)} Volume has been set to ${amount}%**`),
        queueEmpty: () => new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("**❎  Queue is empty.**"),
        playerInfo: (player?: Player) => {
            if (!player)
                return new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("**🚫  Player does not exist.**");

            if (player.Resource) {
                return new EmbedBuilder()
                    .setColor("LuminousVividPink")
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
            }
            else {
                return new EmbedBuilder()
                    .setColor("Blue")
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

            return new EmbedBuilder()
                .setColor("LuminousVividPink")
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
                        (value, index) => ({
                            name: `${
                                page * 10 + index + 1
                            }. ${value.title.padEnd(35)}`,
                            value: `**[${secToISO(value.duration)}]**`,
                        })
                    )
                );
        },
        fullyAlone: () => new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setTitle("🥬  I have decided to leave to conserve my energy.")
            .setDescription(
                "_**Since there was nobody in the voice channel.**_"
            ),
        reshuffle: () => new EmbedBuilder()
            .setColor("Green")
            .setTitle("**✅  Successfuly reshuffled queue.**"),
        ping: (ping?: number) => {
            const title = ping ? `I have pinged ${ping} ms late.` : "There is no application.";

            const comment = !ping ? "How am I speaking then?" : ping > 250 ? "I'm kinda slowpoke ngl." :
                ping > 200 ? "I can do better than this." :
                    "Dream's speed!";

            return new EmbedBuilder()
                .setColor("Random")
                .setTitle(`**${title}**`)
                .setDescription(`_**${comment}**_`);
        }
    };
}

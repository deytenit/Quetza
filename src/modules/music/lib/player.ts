import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    entersState,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { Guild, Message, TextChannel, User, VoiceBasedChannel } from "discord.js";
import ytdl from "discord-ytdl-core";

import { fetchStream } from "./fetch.js";
import Filter from "./filter.js";
import I18n from "./i18n.js";
import { largestCommonSequence } from "./misc.js";
import Music from "./music.js";
import Queue from "./queue.js";
import { Track } from "./types.js";

export default class Player {
    private music: Music;
    private guild: Guild;

    private msgChannel: TextChannel;
    public get channel(): TextChannel {
        return this.msgChannel;
    }
    public set channel(x: TextChannel) {
        this.msgChannel = x;
    }

    private message: Message | undefined;

    public internalConnection: VoiceConnection | undefined;
    public get connection(): VoiceConnection | undefined {
        return this.internalConnection;
    }

    private internalPlayer: AudioPlayer;
    public get player(): AudioPlayer {
        return this.internalPlayer;
    }

    private playerResource: AudioResource<Track> | undefined;
    public get resource(): AudioResource<Track> | undefined {
        return this.playerResource;
    }

    private resourceVolume = 100;
    public get volume(): number {
        return this.resourceVolume;
    }
    public set volume(x: number) {
        this.resourceVolume = Math.max(0, Math.min(150, x));

        if (this.playerResource && this.playerResource.volume) {
            this.playerResource.volume.setVolumeLogarithmic(this.resourceVolume / 100);
        }
    }

    public readonly queue = new Queue();

    public readonly filter = new Filter();

    public readonly created: Date = new Date();

    public constructor(guild: Guild, music: Music, textChannel: TextChannel) {
        this.music = music;
        this.guild = guild;
        this.msgChannel = textChannel;

        this.internalPlayer = createAudioPlayer();

        this.internalPlayer.on(AudioPlayerStatus.Idle, async () => this.resourceEndResolvable());
    }

    private resourceGenerator(track: Track, seek?: number) {
        const stream = ytdl(track.url, {
            opusEncoded: false,
            fmt: "mp3",
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek ? seek / 1000 : undefined,
            encoderArgs: !this.filter.empty() ? ["-af", this.filter.toString()] : undefined
        });

        this.playerResource = createAudioResource(stream, {
            inlineVolume: true,
            metadata: track
        });

        if (seek) {
            this.playerResource.playbackDuration = seek;
        }

        if (this.playerResource.volume) {
            this.playerResource.volume.setVolumeLogarithmic(this.resourceVolume / 100);
        }

        return this.playerResource;
    }

    private resourceEndResolvable(): void {
        if (this.playerResource) {
            this.playerResource.encoder?.destroy();
        }

        if (this.queue.next()) {
            this.play();
        } else {
            this.playerResource = undefined;
            this.internalPlayer.stop();
        }
    }

    private async messageResolvable(track: Track) {
        if (this.message) {
            await this.message.delete();
        }

        this.message = await this.msgChannel.send({
            embeds: [I18n.embeds.nowPlaying(track)]
        });
    }

    private async search(query: string, requester: User): Promise<Track[] | undefined> {
        const response = await fetchStream(query, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificate: true,
            flatPlaylist: true,
            skipDownload: true,
            defaultSearch: "ytsearch"
        });

        if (!response) {
            return undefined;
        }

        const tracks: Track[] = [];

        if (response.entries) {
            for (const entry of response.entries) {
                tracks.push({
                    url: `https://youtube.com/watch?v=${entry.id}`,
                    title: entry.title,
                    thumbnail: `https://img.youtube.com/vi/${entry.id}/default.jpg`,
                    duration: entry.duration,
                    requester: requester
                });
            }
        } else {
            tracks.push({
                url: `https://youtube.com/watch?v=${response.id}`,
                title: response.title,
                thumbnail: `https://img.youtube.com/vi/${response.id}/default.jpg`,
                duration: response.duration,
                requester: requester
            });
        }

        return tracks;
    }

    public play(seek?: number): void {
        const track = this.queue.current();

        if (!this.internalConnection || !track) {
            return;
        }

        this.internalPlayer.play(this.resourceGenerator(track, seek));

        this.internalConnection.subscribe(this.internalPlayer);

        this.messageResolvable(track);
    }

    public connect(channel: VoiceBasedChannel): void {
        if (this.internalConnection) {
            this.internalConnection.destroy();
        }

        this.internalConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });

        this.internalConnection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                await Promise.race([
                    entersState(
                        this.internalConnection as VoiceConnection,
                        VoiceConnectionStatus.Signalling,
                        10_000
                    ),
                    entersState(
                        this.internalConnection as VoiceConnection,
                        VoiceConnectionStatus.Connecting,
                        10_000
                    )
                ]);
            } catch (error) {
                this.destroy();
            }
        });
    }

    public async add(query: string, requester: User, index?: number): Promise<Track | undefined> {
        const tracks = await this.search(query, requester);

        if (!tracks) {
            return;
        }

        this.queue.push(tracks, index);

        return tracks[0];
    }

    public jump(query: number | string): boolean {
        let position = typeof query === "number" ? query : -1;
        let diff = 0;

        if (typeof query === "string") {
            this.queue.tracks.forEach((track, index) => {
                const tempDiff = largestCommonSequence(track.title, query);
                if (diff < tempDiff) {
                    diff = tempDiff;
                    position = index;
                }
            });
        }

        if (position !== -1 && this.queue.jump(position)) {
            this.play();
            return true;
        }

        return false;
    }

    public remove(query?: number | string): Track | undefined {
        const oldPosition = this.queue.position;

        let newPosition = typeof query === "number" ? query : this.queue.position;
        let diff = 0;

        if (typeof query === "string") {
            this.queue.tracks.forEach((track, index) => {
                const tempDiff = largestCommonSequence(track.title, query);
                if (diff < tempDiff) {
                    diff = tempDiff;
                    newPosition = index;
                }
            });
        }

        const track = this.queue.pop(newPosition);

        if (track) {
            if (oldPosition === newPosition) {
                this.play();
            }
            return track;
        }

        return undefined;
    }

    public seek(time: number): void {
        this.play(time);
    }

    public clear(): void {
        this.queue.clear();
        this.playerResource = undefined;

        if (this.internalPlayer) {
            this.internalPlayer.stop();
        }
    }

    public destroy(): void {
        if (this.internalConnection) {
            this.internalConnection.destroy();
        }

        this.internalPlayer.stop();
        this.music.delete(this.guild.id);
    }

    public pause(): boolean {
        if (this.internalPlayer.state.status === AudioPlayerStatus.Paused) {
            this.internalPlayer.unpause();
            return false;
        } else {
            this.internalPlayer.pause();
            return true;
        }
    }

    public shuffle(): void {
        this.queue.shuffle();

        if (this.playerResource) {
            this.internalPlayer.stop();
            this.play();
        }
    }

    public skip(): void {
        this.internalPlayer.stop();
    }

    public setFilter(filter?: string): void {
        this.filter.toggle(filter);

        if (this.playerResource) {
            this.play(this.playerResource.playbackDuration);
        }
    }
}

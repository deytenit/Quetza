import {
    VoiceConnection,
    AudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    AudioResource,
    DiscordGatewayAdapterCreator,
    VoiceConnectionStatus,
    entersState,
} from "@discordjs/voice";

import {
    Guild,
    Message,
    TextBasedChannel,
    User,
    VoiceBasedChannel,
} from "discord.js";

import Music from "./Music";
import Filter from "./Filter";
import Queue from "./Queue";
import { fetchStream } from "./Fetch";
import I18n from "./I18n";

import ytdl from "discord-ytdl-core";
import { track } from "./Types";
import { largestCommonSequence } from "./Misc";

export default class Player {
    private music: Music;
    private guild: Guild;

    private channel: TextBasedChannel;
    public get Channel(): TextBasedChannel {
        return this.channel;
    }
    public set Channel(x: TextBasedChannel) {
        this.channel = x;
    }

    private connection: VoiceConnection | undefined;
    public get Connection(): VoiceConnection | undefined {
        return this.connection;
    }

    private player: AudioPlayer;
    public get Player(): AudioPlayer {
        return this.player;
    }

    private filter = new Filter();
    public get Filter(): Filter {
        return this.filter;
    }
    private queue = new Queue();
    public get Queue(): Queue {
        return this.queue;
    }

    private resource: AudioResource<track> | undefined;
    public get Resource(): AudioResource<track> | undefined {
        return this.resource;
    }

    private message: Message | undefined;
    private created: Date = new Date();
    public get Created(): Date {
        return this.created;
    }

    private volume = 100;
    public get Volume(): number {
        return this.volume;
    }
    public set Volume(x: number) {
        this.volume = Math.max(0, Math.min(150, x));

        if (this.resource && this.resource.volume) this.resource.volume.setVolumeLogarithmic(this.volume / 100);
    }

    public constructor(
        guild: Guild,
        music: Music,
        textBasedChannel: TextBasedChannel
    ) {
        this.music = music;
        this.guild = guild;
        this.channel = textBasedChannel;

        this.player = createAudioPlayer();

        this.player.on(AudioPlayerStatus.Idle, async () =>
            this.resourceEndResolvable()
        );
    }

    private resourceGenerator(track: track, seek?: number) {
        const stream = ytdl(track.url, {
            opusEncoded: false,
            fmt: "mp3",
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek ? seek / 1000 : undefined,
            encoderArgs: !this.filter.empty()
                ? ["-af", this.filter.toString()]
                : undefined,
        });

        this.resource = createAudioResource(stream, {
            inlineVolume: true,
            metadata: track,
        });

        if (seek) this.resource.playbackDuration = seek;
        if (this.resource.volume) this.resource.volume.setVolumeLogarithmic(this.volume / 100);

        return this.resource;
    }

    private resourceEndResolvable(): void {
        if (this.resource) this.resource.encoder?.destroy();

        if (this.queue.next()) {
            this.play();
        }
        else {
            this.resource = undefined;
            this.player.stop();
        }
    }

    private async messageResolvable(track: track) {
        if (this.message) await this.message.delete();

        this.message = await this.channel.send({
            embeds: [I18n.en.nowPlaying(track)],
        });
    }

    private async search(
        query: string,
        requester: User
    ): Promise<track[] | undefined> {
        const response = await fetchStream(query, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificate: true,
            flatPlaylist: true,
            skipDownload: true,
            defaultSearch: "ytsearch",
        });

        if (!response) return undefined;

        const tracks: track[] = [];

        if (response.entries) {
            for (const entry of response.entries) {
                tracks.push({
                    url: `https://youtube.com/watch?v=${entry.id}`,
                    title: entry.title,
                    thumbnail: `https://img.youtube.com/vi/${entry.id}/default.jpg`,
                    duration: entry.duration,
                    requester: requester,
                });
            }
        } 
        else {
            tracks.push({
                url: `https://youtube.com/watch?v=${response.id}`,
                title: response.title,
                thumbnail: `https://img.youtube.com/vi/${response.id}/default.jpg`,
                duration: response.duration,
                requester: requester,
            });
        }

        return tracks;
    }

    public play(seek?: number): void {
        const track = this.queue.current();

        if (!this.connection || !track) return;

        this.player.play(this.resourceGenerator(track, seek));

        this.connection.subscribe(this.player);

        this.messageResolvable(track);
    }

    public connect(channel: VoiceBasedChannel): void {
        if (this.connection) this.connection.destroy();

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild
                .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });

        this.connection.on(
            VoiceConnectionStatus.Disconnected,
            async () => {
                try {
                    await Promise.race([
                        entersState(
                            this.connection as VoiceConnection,
                            VoiceConnectionStatus.Signalling,
                            10_000
                        ),
                        entersState(
                            this.connection as VoiceConnection,
                            VoiceConnectionStatus.Connecting,
                            10_000
                        ),
                    ]);
                } 
                catch (error) {
                    this.destroy();
                }
            }
        );
    }

    public async add(
        query: string,
        requester: User,
        index?: number
    ): Promise<track | undefined> {
        const tracks = await this.search(query, requester);

        if (!tracks) return;

        this.queue.push(tracks, index);

        return tracks[0];
    }

    public jump(query: number | string): boolean {
        let position = typeof query === "number" ? query : -1;
        let diff = 0;

        if (typeof query === "string") {
            this.queue.Tracks.forEach((track, index) => { 
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

    public remove(query?: number | string): track | undefined {
        const oldPosition = this.queue.Position;

        let newPosition = typeof query === "number" ? query : this.queue.Position;
        let diff = 0;

        if (typeof query === "string") {
            this.queue.Tracks.forEach((track, index) => { 
                const tempDiff = largestCommonSequence(track.title, query);
                if (diff < tempDiff) {
                    diff = tempDiff;
                    newPosition = index;
                }
            });
        }

        const track = this.queue.pop(newPosition);

        if (track) {
            if (oldPosition === newPosition) this.play();
            return track;
        }

        return undefined;
    }

    public seek(time: number): void {
        this.play(time);
    }

    public clear(): void {
        this.queue.clear();
        this.resource = undefined;
        if (this.player) this.player.stop();
    }

    public destroy(): void {
        if (this.connection) this.connection.destroy();
        this.player.stop();
        this.music.del(this.guild.id);
    }

    public pause(): boolean {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
            return false;
        } 
        else {
            this.player.pause();
            return true;
        }
    }

    public shuffle(): void {
        this.queue.shuffle();
        if (this.resource) {
            this.player.stop();
            this.play();
        }
    }

    public skip(): void {
        this.player.stop();
    }

    public setFilter(filter?: string): void {
        this.filter.toggle(filter);
        if (this.resource) this.play(this.resource.playbackDuration);
    }
}

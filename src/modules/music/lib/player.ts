import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection
} from "@discordjs/voice";
import { Guild, GuildTextBasedChannel, Message, User, VoiceBasedChannel } from "discord.js";

import { fetchInfo, ytdlStream } from "./fetch.js";
import Filter from "./filter.js";
import { largestCommonSequence } from "./misc.js";
import Music from "./music.js";
import Queue from "./queue.js";
import replies from "./replies.js";
import { Track } from "./types.js";

export default class Player {
    private music: Music;
    private guild: Guild;

    private channel_: GuildTextBasedChannel;
    public get channel(): GuildTextBasedChannel {
        return this.channel_;
    }
    public set channel(x: GuildTextBasedChannel) {
        this.channel_ = x;
    }

    private message_?: Message;

    private connection_?: VoiceConnection;
    public get connection(): VoiceConnection | undefined {
        return this.connection_;
    }

    private player_: AudioPlayer;
    public get player(): AudioPlayer {
        return this.player_;
    }

    private resource_: AudioResource<Track> | undefined;
    public get resource(): AudioResource<Track> | undefined {
        return this.resource_;
    }

    private volume_ = 100;
    public get volume(): number {
        return this.volume_;
    }
    public set volume(x: number) {
        this.volume_ = Math.max(0, Math.min(150, x));

        if (this.resource_ && this.resource_.volume) {
            this.resource_.volume.setVolumeLogarithmic(this.volume_ / 100);
        }
    }

    public readonly queue = new Queue();

    public readonly filter = new Filter();

    public readonly createdAt: Date = new Date();

    public constructor(guild: Guild, music: Music, channel: GuildTextBasedChannel) {
        this.music = music;
        this.guild = guild;
        this.channel_ = channel;

        this.player_ = createAudioPlayer();

        this.player_.on(AudioPlayerStatus.Idle, async () => this.resourceEndResolvable());
    }

    private resourceGenerator(track: Track, seek?: number) {
        const stream = ytdlStream(track.url, {
            opusEncoded: true,
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek ? seek / 1000 : undefined,
            encoderArgs: !this.filter.empty() ? ["-af", this.filter.toString()] : undefined
        });

        this.resource_ = createAudioResource(stream, {
            inlineVolume: true,
            metadata: track
        });

        if (seek) {
            this.resource_.playbackDuration = seek;
        }

        if (this.resource_.volume) {
            this.resource_.volume.setVolumeLogarithmic(this.volume_ / 100);
        }

        return this.resource_;
    }

    private resourceEndResolvable(): void {
        if (this.resource_) {
            this.resource_.encoder?.destroy();
        }

        if (this.queue.next()) {
            this.play();
        } else {
            this.player_.stop(true);
            this.resource_ = undefined;
        }
    }

    private async messageResolvable(track: Track) {
        if (this.message_?.deletable) {
            await this.message_.delete().catch();
        }

        this.message_ = await this.channel_.send(replies.nowPlaying(track));
    }

    private async search(query: string, requester: User): Promise<Track[] | undefined> {
        const info = await fetchInfo(query);

        if (info.length === 0) {
            return undefined;
        }

        return info.map((value) => {
            return { ...value, requester: requester };
        });
    }

    public async play(seek?: number): Promise<void> {
        const track = this.queue.current();

        if (!this.connection_ || !track) {
            return;
        }

        this.player_.play(this.resourceGenerator(track, seek));

        this.connection_.subscribe(this.player_);

        await this.messageResolvable(track);
    }

    public connect(channel: VoiceBasedChannel): void {
        if (
            this.connection_?.joinConfig.channelId === channel.id &&
            this.connection_.joinConfig.guildId === channel.guildId
        ) {
            return;
        }

        if (this.connection_) {
            this.connection_.destroy();
        }

        this.connection_ = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });

        this.connection_.subscribe(this.player_);
    }

    public async add(query: string, requester: User, index?: number): Promise<Track | undefined> {
        const tracks = await this.search(query, requester);

        if (!tracks) {
            return;
        }

        this.queue.push(tracks, index);

        return tracks[0];
    }

    public jump(query: number | string): number | undefined {
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
            return position;
        }

        return undefined;
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
        this.resource_ = undefined;

        if (this.player_) {
            this.player_.stop();
        }
    }

    public destroy(): void {
        if (this.connection_) {
            this.connection_.destroy();
        }

        this.player_.stop();
        this.music.delete(this.guild.id);
    }

    public pause(): boolean {
        if (this.player_.state.status === AudioPlayerStatus.Paused) {
            this.player_.unpause();
            return false;
        } else {
            this.player_.pause();
            return true;
        }
    }

    public shuffle(): void {
        this.queue.shuffle();

        if (this.resource_) {
            this.player_.stop();
            this.play();
        }
    }

    public skip(): void {
        this.player_.stop();
    }

    public setFilter(filter?: string): boolean {
        const status = this.filter.toggle(filter);

        if (this.resource_) {
            this.play(this.resource_.playbackDuration);
        }

        return status;
    }
}

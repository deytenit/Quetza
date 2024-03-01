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

import { clamp } from "$lib/misc.js";

import { dlpInfo, dlpStream } from "./fetch/fetch.js";
import Filter from "./filter.js";
import { largestCommonSequence } from "./misc.js";
import Music from "./music.js";
import Queue from "./queue.js";
import replies from "./replies.js";
import { Track } from "./types.js";

/**
 * Defines guild music player connected to a voice channel by wrapping AudioPlayer, Queue, VoiceConnection, etc.
 *
 * @public
 */
export default class Player {
    /**
     * Volume limiter clamp.
     */
    public static readonly VOLUME_CLAMP = clamp(0, 150);

    /**
     * Module controller orchistrate guild-player mapping.
     */
    private music_: Music;

    /**
     * {@link Player} owner guild.
     *
     * @remarks No different {@link Player} instances can have same {@link Guild}.
     */
    private guild_: Guild;

    /**
     * {@link Guild | Guild's} text based channel for player notifications,
     * such as Current Playing Track.
     */
    private channel_: GuildTextBasedChannel;
    public get channel(): GuildTextBasedChannel {
        return this.channel_;
    }
    public set channel(x: GuildTextBasedChannel) {
        this.channel_ = x;
    }

    /**
     * Previous notification message.
     */
    private message_?: Message;

    /**
     * A connection to the voice channel of a {@link Guild}.
     *
     * @readonly
     */
    private connection_?: VoiceConnection;
    public get connection(): VoiceConnection | undefined {
        return this.connection_;
    }

    /**
     * Player for {@link AudioResource} that is subscribed to the most recent {@link VoiceConnection}.
     *
     * @readonly
     */
    private player_: AudioPlayer;
    public get player(): AudioPlayer {
        return this.player_;
    }

    /**
     * Represents an Audio Resource that can be played by {@link AudioPlayer}.
     *
     * @readonly
     */
    private resource_: AudioResource<Track> | undefined;
    public get resource(): AudioResource<Track> | undefined {
        return this.resource_;
    }

    /**
     * Inline volume for an {@link AudioResource}.
     * Must be clamped by {@link VOLUME_CLAMP}.
     */
    private volume_ = 100;
    public get volume(): number {
        return this.volume_;
    }
    public set volume(x: number) {
        this.volume_ = Player.VOLUME_CLAMP(x);

        if (this.resource_?.volume) {
            this.resource_.volume.setVolumeLogarithmic(this.volume_ / 100);
        }
    }

    /**
     * Queue manager of the {@link Player}.
     */
    public readonly queue = new Queue();

    /**
     * Filter manager of the {@link Player}.
     */
    public readonly filter = new Filter();

    /**
     * Timestamp when {@link Player} was created.
     */
    public readonly createdAt: Date = new Date();

    /**
     * Player constructor.
     *
     * @param guild - {@link Guild} for which player will be created for
     * @param music - Module controller for managing player own existence
     * @param channel - Initial text based channed for player notifications
     */
    public constructor(guild: Guild, music: Music, channel: GuildTextBasedChannel) {
        this.music_ = music;
        this.guild_ = guild;
        this.channel_ = channel;

        this.player_ = createAudioPlayer();

        this.player_.on(AudioPlayerStatus.Idle, async () => this.resourceEndResolvable());
    }

    /**
     * Creates {@link AudioResource | an Audio Resource} for {@link an AudioPlayer}.
     *
     * @returns Configured audio resource ready to be played
     *
     * @param track - Metadata to generate resource from and embed into it
     * @param seek - Amount of seconds to start playback from
     */
    private async resourceGenerator(track: Track, seek?: number): Promise<AudioResource<Track>> {
        const probe = await dlpStream(track.url, {
            seek: seek ? seek / 1000 : undefined,
            ffmpeg: !this.filter.empty() ? ["-af", this.filter.toString()] : undefined
        });

        this.resource_ = createAudioResource(probe, {
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

    /**
     * Resolves player behavior after {@link AudioResource} ends.
     *
     * @remarks Force destroys ended resource,
     * and either plays next one or stops,
     * depending on {@link Queue#next | Queue.next() method}
     */
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

    /**
     * Resolves notification emittion.
     *
     * @remarks Tries to delete previous notification message,
     * and send next one
     */
    private async messageResolvable(track: Track) {
        if (this.message_?.deletable) {
            await this.message_.delete().catch();
        }

        this.message_ = await this.channel_.send(replies.nowPlaying(track));
    }

    /**
     * Fetches {@link DlpInfo} and converts it to {@link Track | Track metadata}.
     *
     * @returns Promise to Track list or undefined, if found nothing.
     *
     * @param query - String that Dlp will try to resolve
     * @param requester - {@link User} that requested Tracks returned to complete convertion
     */
    private async search(query: string, requester: User): Promise<Track[] | undefined> {
        const info = await dlpInfo(query);

        return info.map((value) => {
            return { ...value, requester: requester };
        });
    }

    /**
     * Plays current {@link Queue} track from position specified.
     *
     * @param seek - Amount of seconds to start playback from
     */
    public async play(seek?: number): Promise<void> {
        const track = this.queue.current();

        if (!this.connection_ || !track) {
            return;
        }

        this.player_.play(await this.resourceGenerator(track, seek));

        this.connection_.subscribe(this.player_);

        await this.messageResolvable(track);
    }

    /**
     * Creates connection to guild's voice based channel,
     * previously destroying existing connection.
     *
     * @param channel - {@link VoiceBasedChannel} to connect to
     */
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

    /**
     * Adds {@link Track | Track(s)} found by {@link search | the search method} to the {@link queue}.
     *
     * @returns Track metadata if found, undefined otherwise
     *
     * @param query - String that will be passed to the search method
     * @param requester - {@link User} that requested the query
     * @param index - Position to insert track to
     * Value < 0 resolves to 0
     * Value >= (queue size) resolves to (queue end)
     */
    public async add(query: string, requester: User, index?: number): Promise<Track | undefined> {
        const tracks = await this.search(query, requester);

        if (!tracks) {
            return;
        }

        this.queue.push(tracks, index);

        return tracks[0];
    }

    /**
     * Jumps across {@link queue} to the position determined by the query.
     *
     * @remarks If string passed, then position will be determined by
     * the largest common sequence across all the {@link queue} titles.
     *
     * @return Position to which jump was perfomed
     *
     * @param query - String of {@link Track} title or position to jump to
     */
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

    /**
     * Removes {@link Track} from {@link queue | the queue} by the position determined by the query.
     *
     * @remarks If string passed, then position will be determined by
     * the largest common sequence across all the {@link queue} titles.
     *
     * @return Metadata of removed track, or undefined if nothing happened
     *
     * @param query - String of {@link Track} title or position to perfome removal at
     */
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

    /**
     * Restarts playback from timecode specified.
     *
     * @param time - Amount of seconds to start playback from
     */
    public seek(time: number): void {
        this.play(time);
    }

    /**
     * Clears {@link queue} completely - not destroying {@link voiceConnection_}.
     */
    public clear(): void {
        this.queue.clear();
        this.resource_ = undefined;

        if (this.player_) {
            this.player_.stop();
        }
    }

    /**
     * Destroys this instance of {@link Player} and deletes it from controller mapping.
     */
    public destroy(): void {
        if (this.connection_) {
            this.connection_.destroy();
        }

        this.player_.stop();
        this.music_.delete(this.guild_.id);
    }

    /**
     * Pauses/unpauses {@link AudioPlayer} playback.
     *
     * @returns True if paused, or False if unpaused
     */
    public pause(): boolean {
        if (this.player_.state.status === AudioPlayerStatus.Paused) {
            this.player_.unpause();
            return false;
        } else {
            this.player_.pause();
            return true;
        }
    }

    /**
     * Reshuffles {@link queue} order - will start new playback from the same position in the queue.
     */
    public shuffle(): void {
        this.queue.shuffle();

        if (this.resource_) {
            this.player_.stop();
            this.play();
        }
    }

    /**
     * Stops {@link player_} that will emit {@link resourceEndResolvable}.
     *
     * @see {@link resourceEndResolvable} for understanding full behavior
     */
    public skip(): void {
        this.player_.stop();
    }

    /**
     * Applies {@link Filter} preset to the current playback.
     *
     * @returns True if applied, false if revoked
     *
     * @param filter - Name of a filter to apply
     * Must exist in Filter class
     */
    public setFilter(filter?: string): boolean {
        const status = this.filter.toggle(filter);

        if (this.resource_) {
            this.play(this.resource_.playbackDuration);
        }

        return status;
    }
}

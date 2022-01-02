import {
    VoiceConnection, AudioPlayer, createAudioResource,
    AudioPlayerStatus, joinVoiceChannel, createAudioPlayer,
    AudioResource, DiscordGatewayAdapterCreator, VoiceConnectionStatus,
    entersState
} from "@discordjs/voice";

import {
    ColorResolvable, Guild, Message,
    MessageEmbed, StageChannel, TextChannel, User,
    VoiceChannel
} from "discord.js";

import { design } from "../../config";
import ytdl from "discord-ytdl-core";
import { track, loopOption } from "./Types";
import { randomShuffle } from "../Misc";
import { searchTakts } from "../SearchTakts/SearchInfo";
import { Filter } from "./Filter";

export class Player {
    private guild: Guild;
    private music: Music;

    private channel: TextChannel;
    public get Channel(): TextChannel {
        return this.channel;
    }

    private connection: VoiceConnection | undefined;
    public get Connection(): VoiceConnection | undefined {
        return this.connection;
    }

    private player: AudioPlayer | undefined;
    public get Player(): AudioPlayer | undefined {
        return this.player;
    }

    private queue: track[] = [];
    public get Queue(): track[] {
        return this.queue;
    }
    public set Queue(queue: track[]) {
        this.queue = queue;
    }

    private nowPlayingPos: number;
    public get NowPlayingPos(): number {
        return this.nowPlayingPos;
    }

    private nowPlaying: AudioResource<track> | undefined;
    public get NowPlaying(): AudioResource<track> | undefined {
        return this.nowPlaying;
    }

    private filters: Filter;
    public get Filters(): string[] {
        return this.filters.ActiveFilters;
    }

    private repeatMode: loopOption = "LOOP";
    private message: Message | undefined;

    public constructor(playerGuild: Guild, clientMusic: Music, ctxChannel: TextChannel) {
        this.music = clientMusic;
        this.guild = playerGuild;
        this.channel = ctxChannel;
        this.filters = new Filter();
        this.nowPlayingPos = 0;
    }

    private async playerCreator(track: track, seek: number): Promise<AudioPlayer> {
        const player = createAudioPlayer();

        const stream = ytdl(track.url, {
            opusEncoded: true,
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek / 1000,
            encoderArgs: !this.filters.empty() ? ["-af", this.filters.toString()] : []
        });

        this.nowPlaying = createAudioResource(stream, {
            inlineVolume: true,
            metadata: track
        });

        await player.play(this.nowPlaying);

        return player;
    }

    private resourceEndResolvable(): boolean {
        if (this.nowPlaying)
            this.nowPlaying.encoder?.destroy();

        switch (this.repeatMode) {
            case "NONE": {
                if (++this.nowPlayingPos >= this.queue.length) {
                    this.nowPlayingPos = 0;
                    this.nowPlaying = undefined;
                    return false;
                }
                return true;
            }
            case "LOOP": {
                this.nowPlayingPos = (this.nowPlayingPos + 1) % this.queue.length;
                return true;
            }
            case "SONG": return true;
        }

        return true;
    }

    private async messageResolvable(track: track): Promise<void> {
        
        if (this.message) {
            this.channel = this.message.channel as TextChannel;

            try {
                await this.message.delete();
            } catch (err) {
                console.log(err);
            }
        }

        const embed = new MessageEmbed()
            .setColor(design.color as ColorResolvable)
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setDescription("Is now beeing played.");

        embed.setAuthor({ name: `@${track.requester.tag}`, iconURL: track.requester.avatarURL() || track.requester.avatarURL as unknown as string});

        this.message = await this.channel.send({ embeds: [embed] });
    }

    private async searchStream(query: string, requester: User): Promise<track[] | undefined> {
        const response = await searchTakts(query, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificate: true,
            flatPlaylist: true,
            skipDownload: true,
            defaultSearch: "ytsearch"
        });
        
        if (!response)
            return undefined;

        let tracks: track[] = [];

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
        }
        else {
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

    public async play(seek = 0): Promise<void> {
        if (!this.connection || this.queue.length === 0)
            return;

        if (this.nowPlaying)
            this.nowPlaying.encoder?.destroy();
    
        const track = this.queue[this.nowPlayingPos];

        this.player = await this.playerCreator(track, seek);

        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Idle, async () => {
            if (this.resourceEndResolvable())
                await this.play();
        });

        await this.messageResolvable(track);
    }

    public connect(channel: VoiceChannel | StageChannel): void {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(this.connection as VoiceConnection, VoiceConnectionStatus.Signalling, 10_000),
                    entersState(this.connection as VoiceConnection, VoiceConnectionStatus.Connecting, 10_000),
                ]);
            }
            catch (error) {
                this.destroy();
            }
        });
    }

    public async addTrack(query: string, requester: User, index?: number): Promise<track | undefined> {
        const metadata = await this.searchStream(query, requester);

        if (!metadata) {
            return undefined;
        }

        if (!index || index >= this.queue.length) {
            this.queue = this.queue.concat(metadata);
        }
        else {
            this.queue.splice(Math.max(0, index), 0, ...metadata)
            if (this.nowPlayingPos >= index)
                this.nowPlayingPos++;
        }

        return metadata[0];
    }

    public clear() {
        this.queue = [];
        this.nowPlayingPos = 0;
        this.nowPlaying = undefined;
        if (this.player)
            this.player.stop();
    }

    public destroy() {
        if (this.connection)
            this.connection.destroy();
        if (this.nowPlaying)
            this.nowPlaying.encoder?.destroy;
        this.music.delPlayer(this.guild.id);
    }

    public async jump(query: number | string): Promise<boolean> {
        if (!this.player)
            return false;

        if (typeof query === "number" && query < this.queue.length && query >= 0) {
            this.nowPlayingPos = query;
            await this.play();
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    this.nowPlayingPos = i;
                    await this.play();
                    return true;
                }
            }
        }
        return false;
    }

    public async remove(query: number | string): Promise<boolean> {
        if (typeof query === "number" && query < this.queue.length && query >= 0) {
            this.queue.splice(query, 1);
            if (query === this.nowPlayingPos)
                await this.play();
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    this.queue.splice(i, 1);
                    if (i === this.nowPlayingPos)
                        await this.play();
                    return true;
                }
            }
        }
        return false;
    }
    
    public async seek(time: number): Promise<void> {
        await this.play(time * 1000);
    }

    public pause(): boolean {
        if (!this.player)
            return false;

        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
            return false;
        }
        else {
            this.player.pause();
            return true;
        }
    }

    public repeat(mode: loopOption): void {
        this.repeatMode = mode;
    }

    public volume(amount: number): boolean {
        if (amount > 0 && amount < Infinity && this.nowPlaying && this.nowPlaying.volume) {
            this.nowPlaying.volume.setVolumeLogarithmic(amount / 100);
            return true;
        }
        return false;
    }

    public shuffle(): void {
        this.queue = randomShuffle(this.queue);
    }

    public skip(): void {
        if (this.player)
            this.player.stop();
    }

    public async filter(filter: string | null): Promise<boolean> {
        if (this.filters.toggleFilter(filter)) {
            await this.play(this.nowPlaying?.playbackDuration);
            return true;
        }
        return false;
    }
}

export class Music {
    private players = new Map<string, Player>();

    public getPlayer(guildId: string): Player | undefined {
        const player = this.players.get(guildId);
        if (player)
            return player;
    }

    public genPlayer(guild: Guild, music: Music, channel: TextChannel): Player {
    const player = this.players.get(guild.id);
        if (!player) {
            const newPlayer = new module.exports.Player(guild, music, channel);
            this.players.set(guild.id, newPlayer);
            return newPlayer;
        }
        else {
            return player;
        }
    }

    public delPlayer(guildId: string) {
        this.players.delete(guildId);
    }
}
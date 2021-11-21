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

import { design } from "../config";
import ytdl from "discord-ytdl-core";
import { track, filter, loopOption } from "./Types";
import { random_shuffle } from "./Misc";
import yts from "yt-search";

export class Player {
    public guild: Guild;
    public music: Music;

    public connection: VoiceConnection | undefined;
    public player: AudioPlayer | undefined;

    public queue: track[] = [];
    public queuePosition: number = 0;
    public nowPlaying: AudioResource | undefined;
    public filters: filter = {};
    public repeatMode: loopOption = "LOOP";

    public channel: TextChannel;
    public message: Message | undefined;

    public constructor(playerGuild: Guild, clientMusic: Music, ctxChannel: TextChannel) {
        this.music = clientMusic;
        this.guild = playerGuild;
        this.channel = ctxChannel;
    }

    private async _playerCreator(track: track, seek: number): Promise<AudioPlayer> {
        const player = createAudioPlayer();

        const stream = ytdl(track.url, {
            opusEncoded: true,
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek
        });

        this.nowPlaying = createAudioResource(stream, {
            inlineVolume: true,
            metadata: track
        });

        await player.play(this.nowPlaying);

        return player;
    }

    private _resourceEndResolvable(): boolean {
        switch (this.repeatMode) {
            case "NONE": {
                if (++this.queuePosition >= this.queue.length) {
                    this.queuePosition = 0;
                    this.nowPlaying = undefined;
                    return false;
                }
                return true;
            }
            case "LOOP": {
                this.queuePosition = (this.queuePosition + 1) % this.queue.length;
                return true;
            }
            case "SONG": return true;
        }

        return true;
    }

    private async _messageResolvable(track: track): Promise<void> {
        
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
            .setAuthor(`@${track.requester.tag}`, track.requester.avatarURL() as string)
            .setDescription("Is now beeing played.");

        this.message = await this.channel.send({ embeds: [embed] });
    }

    private async _songFinder(query: string) {
        return (await yts(query)).videos[0];
    }

    public async play(seek: number = 0): Promise<void> {
        if (!this.connection || this.queue.length === 0)
            return;
       
        const track = this.queue[this.queuePosition];

        this.player = await this._playerCreator(track, seek);
        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Idle, async () => {
            if (this._resourceEndResolvable())
                await this.play();
        });

        await this._messageResolvable(track);
    }

    public connect(channel: VoiceChannel | StageChannel): void {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            selfDeaf: true,
            adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(this.connection as VoiceConnection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(this.connection as VoiceConnection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            }
            catch (error) {
                this.destroy();
            }
        });
    }

    public async addTrack(query: string, requester: User, index?: number): Promise<track> {
        const songInfo = await this._songFinder(query);
       
        const metadata: track = {
            url: songInfo.url,
            title: songInfo.title,
            thumbnail: songInfo.thumbnail,
            duration: songInfo.duration.seconds,
            requester: requester
        };

        if (!index || index >= this.queue.length)
            this.queue.push(metadata);
        else {
            this.queue.splice(Math.max(0, index), 0, metadata)
            if (this.queuePosition >= index)
                this.queuePosition++;
        }

        return metadata;
    }

    public clear() {
        this.queue = [];
        this.queuePosition = 0;
        this.nowPlaying = undefined;
        if (this.player)
            this.player.stop();
    }

    public destroy() {
        if (this.connection)
            this.connection.destroy();
        this.music.delPlayer(this.guild.id);
    }

    public async jump(query: number | string): Promise<boolean> {
        if (!this.player)
            return false;

        if (typeof query === "number" && query < this.queue.length && query >= 0) {
            this.queuePosition = query;
            await this.play();
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    this.queuePosition = i;
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
            if (query === this.queuePosition)
                await this.play();
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    this.queue.splice(i, 1);
                    if (i === this.queuePosition)
                        await this.play();
                    return true;
                }
            }
        }
        return false;
    }
    
    public async seek(time: number): Promise<void> {
        await this.play(time);
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
        this.queue = random_shuffle(this.queue);
    }

    public skip(): void {
        if (this.player)
            this.player.stop();
    }
}

export class Music {
    private _players = new Map<string, Player>();

    public getPlayer(guildId: string): Player | undefined {
        const player = this._players.get(guildId);
        if (player)
            return player;
    }

    public genPlayer(guild: Guild, music: Music, channel: TextChannel): Player {
       const player = this._players.get(guild.id);
        if (!player) {
            const newPlayer = new module.exports.Player(guild, music, channel);
            this._players.set(guild.id, newPlayer);
            return newPlayer;
        }
        else {
            return player;
        }
    }

    public delPlayer(guildId: string) {
        this._players.delete(guildId);
    }
}

import { VoiceConnection, AudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, AudioResource, DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { ColorResolvable, Guild, Message, MessageEmbed, StageChannel, User, VoiceChannel } from "discord.js";
import { design } from "../config";
import ytdl from "discord-ytdl-core";
import { track, filter } from "./interfaces";
import { random_shuffle } from "./Misc";
import yts from "yt-search";

export class Player {
    guild: Guild;
    music: Music;

    connection: VoiceConnection | undefined;
    player: AudioPlayer | undefined;
    message: Message | undefined; 

    queue: track[] = [];
    queuePosition = 0;
    nowPlaying: AudioResource | undefined = undefined;
    filters: filter[] = [];
    repeatMode = 0;

    constructor(clientMusic: Music, playerGuild: Guild) {
        this.music = clientMusic;
        this.guild = playerGuild;
    }

    async play(seek = 0) {
        if (!this.connection || this.queue.length === 0)
            return;

       
        const track = this.queue[this.queuePosition];

        const stream = ytdl(track.url, {
            opusEncoded: true,
            filter: "audioonly",
            highWaterMark: 1 << 25,
            seek: seek
        });

        const resource = createAudioResource(stream, {
            inlineVolume: true
        });

        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        await this.player.play(resource);
        this.nowPlaying = resource;

        if (this.message) {
            const channel = this.message.channel;

            try {
                await this.message.delete();
            } catch (err) {
                console.log(err);
            }

            const embed = new MessageEmbed()
                .setColor(design.color as ColorResolvable)
                .setTitle(track.title)
                .setURL(track.url)
                .setThumbnail(track.thumbnail)
                .setAuthor(`@${track.requester.tag}`, track.requester.avatarURL() as string)
                .setDescription("Is now beeing played.");

            this.message = await channel.send({ embeds: [embed] });
        }
              

        this.player.on(AudioPlayerStatus.Idle, async () => {
            this.queuePosition = (this.queuePosition + 1) % this.queue.length;
            await this.play();
        });
    }

    async connect(channel: VoiceChannel | StageChannel) {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            selfDeaf: true,
            adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
        });
    }

    async addTrack(query: string, requester: User, index?: number): Promise<track> {
        const songInfo = (await yts(query)).videos[0];
       
        const metadata: track = {
            url: songInfo.url,
            title: songInfo.title,
            thumbnail: songInfo.thumbnail,
            duration: songInfo.duration.seconds,
            requester: requester
        };

        if (!index)
            this.queue.push(metadata);
        else {
            this.queue.splice(index, 0, metadata)
            if (this.queuePosition >= index)
                this.queuePosition++;
        }

        return metadata;
    }

    clear() {
        this.queue = [];
        this.queuePosition = 0;
        this.nowPlaying = undefined;
        if (this.player)
            this.player.stop();
    }

    destroy() {
        if (this.connection)
            this.connection.disconnect();
        this.music.delPlayer(this.guild.id);
    }

    async jump(query: number | string): Promise<boolean> {
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

    remove(query: number | string): boolean {
        if (typeof query === "number" && query < this.queue.length && query >= 0) {
            if (query === this.queuePosition && this.player)
                this.player.stop();
            this.queue.splice(query);
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    if (i === this.queuePosition && this.player)
                        this.player.stop();
                    this.queue.splice(i);
                    return true;
                }
            }
        }
        return false;
    }
    
    async seek(time: number) {
        await this.play(time);
    }

    pause(): boolean {
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

    repeat(mode: number) {
        this.repeatMode = mode;
    }

    volume(amount: number): boolean {
        if (amount > 0 && amount < Infinity && this.nowPlaying && this.nowPlaying.volume) {
            this.nowPlaying.volume.setVolumeLogarithmic(amount / 100);
            return true;
        }
        return false;
    }

    shuffle() {
        this.queue = random_shuffle(this.queue);
    }

    skip() {
        if (this.player)
            this.player.stop();
    }

    setMessage(message: Message) {
        this.message = message;
    }

}

export class Music {
    players = new Map<string, Player>();

    getPlayer(guildId: string): Player | undefined {
        const player = this.players.get(guildId);
        if (player)
            return player;
    }

    genPlayer(guildId: string): Player {
       const player = this.players.get(guildId);
        if (!player) {
            const newPlayer = new module.exports.Player();
            this.players.set(guildId, newPlayer);
            return newPlayer;
        }
        else {
            return player;
        }
    }

    delPlayer(guildId: string) {
        this.players.delete(guildId);
    }
}
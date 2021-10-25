"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Music = exports.Player = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const ytdl = require("discord-ytdl-core");
const ytsr = require("ytsr");
const Misc_1 = require("./Misc");
class Player {
    guild;
    music;
    connection;
    player;
    message;
    queue = [];
    queuePosition = 0;
    nowPlaying = undefined;
    filters = [];
    repeatMode = 0;
    constructor(clientMusic, playerGuild) {
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
        const resource = (0, voice_1.createAudioResource)(stream, {
            inlineVolume: true,
            metadata: track
        });
        this.player = await (0, voice_1.createAudioPlayer)();
        this.connection.subscribe(this.player);
        await this.player.play(resource);
        this.nowPlaying = resource;
        if (this.message) {
            const channel = this.message.channel;
            try {
                await this.message.delete();
            }
            catch (err) {
                console.log(err);
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(config_1.design.color)
                .setTitle(track.title)
                .setURL(track.url)
                .setThumbnail(track.thumbnail)
                .setAuthor(`@${track.requester.tag}`, track.requester.avatarURL())
                .setDescription("Is now beeing played.");
            this.message = await channel.send({ embeds: [embed] });
        }
        this.player.on(voice_1.AudioPlayerStatus.Idle, async () => {
            this.queuePosition = (this.queuePosition + 1) % this.queue.length;
            await this.play();
        });
    }
    async connect(channel) {
        this.connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guildId,
            selfDeaf: true,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    }
    async addTrack(query, requester, index) {
        let songInfo;
        if (ytdl.validateURL(query))
            songInfo = await ytdl.getInfo(query);
        else
            songInfo = await ytdl.getInfo((await ytsr(query)).refinements[0].url);
        const metadata = {
            url: songInfo.videoDetails.video_url,
            title: songInfo.videoDetails.title,
            thumbnail: songInfo.videoDetails.thumbnails[0].url,
            duration: songInfo.videoDetails.lengthSeconds,
            requester: requester
        };
        if (!index)
            this.queue.push(metadata);
        else {
            this.queue.splice(index, 0, metadata);
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
    async jump(query) {
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
    remove(query) {
        if (typeof query === "number" && query < this.queue.length && query >= 0) {
            if (query === this.queuePosition)
                this.player.stop();
            this.queue.splice(query);
            return true;
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                const track = this.queue[i];
                if (track.title.toLowerCase().includes(String(query).toLowerCase())) {
                    if (i === this.queuePosition)
                        this.player.stop();
                    this.queue.splice(i);
                    return true;
                }
            }
        }
        return false;
    }
    async seek(time) {
        await this.play(time);
    }
    pause() {
        if (!this.player)
            return false;
        if (this.player.state.status === voice_1.AudioPlayerStatus.Paused) {
            this.player.unpause();
            return false;
        }
        else {
            this.player.pause();
            return true;
        }
    }
    repeat(mode) {
        this.repeatMode = mode;
    }
    volume(amount) {
        if (amount > 0 && amount < Infinity && this.nowPlaying && this.nowPlaying.volume) {
            this.nowPlaying.volume.setVolumeLogarithmic(amount / 100);
            return true;
        }
        return false;
    }
    shuffle() {
        this.queue = (0, Misc_1.random_shuffle)(this.queue);
    }
    skip() {
        if (this.player)
            this.player.stop();
    }
    setMessage(message) {
        this.message = message;
    }
}
exports.Player = Player;
class Music {
    players = new Map();
    getPlayer(guildId) {
        const player = this.players.get(guildId);
        if (player)
            return player;
    }
    genPlayer(guildId) {
        const player = new module.exports.Player();
        this.players.set(guildId, player);
        return player;
    }
    delPlayer(guildId) {
        this.players.delete(guildId);
    }
}
exports.Music = Music;
//# sourceMappingURL=Music.js.map
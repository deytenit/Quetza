import { AudioResource } from "@discordjs/voice";
import { ColorResolvable, MessageEmbed } from "discord.js";
import { design } from "../config";
import { track } from "./DiscordMusic/Types";

export async function sleep(ms: number): Promise<unknown> {
    return new Promise(r => setTimeout(r, ms));
}

export function randomShuffle(array: Array<any>) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function queueDesigner(queue: track[], page: number, nowPlaying: AudioResource<track> | undefined, nowPlayingPos: number): MessageEmbed {
    let response = new MessageEmbed()
        .setColor(design.color as ColorResolvable)
        .setTitle("Server queue:");

    if (nowPlaying) {
        const hDuration = `${Math.floor(nowPlaying.metadata.duration / 60 / 10)}${Math.floor(nowPlaying.metadata.duration / 60) % 10}`;
        const mDuration = `${Math.floor(nowPlaying.metadata.duration % 60 / 10)}${nowPlaying.metadata.duration % 60 % 10}`; 
        const hPlayed = `${Math.floor(nowPlaying.playbackDuration / 1000 / 60 / 10)}${Math.floor(nowPlaying.playbackDuration / 1000 / 60) % 10}`;
        const mPlayed = `${Math.floor(Math.floor(nowPlaying.playbackDuration / 1000) % 60 / 10)}${Math.floor(nowPlaying.playbackDuration / 1000) % 60 % 10}`; 

        response.setTitle(`${nowPlayingPos + 1}. ${nowPlaying.metadata.title}`)
            .setURL(nowPlaying.metadata.url)
            .setThumbnail(nowPlaying.metadata.thumbnail)
            .setDescription(`${hPlayed}:${mPlayed} / ${hDuration}:${mDuration}`);
    }

    for (let i = page * 10; i < Math.min(queue.length, (page + 1) * 10); i++) {
        const track = queue[i];

        const h = `${Math.floor(track.duration / 60 / 10)}${Math.floor(track.duration / 60) % 10}`;
        const m = `${Math.floor(track.duration % 60 / 10)}${track.duration % 60 % 10}`;

        response.addField(`${i + 1}. ${track.title.slice(0, 35)}`, `${h}:${m}\n`, true);

    }
    return response;
}
import { MessageEmbed } from "discord.js";
import { track } from "./Types";

export async function sleep(ms: number): Promise<unknown> {
    return new Promise(r => setTimeout(r, ms));
}

export function random_shuffle(array: Array<any>) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function generateQueue(queue: track[], page: number, pos: number): MessageEmbed {
    let h = `${Math.floor(queue[pos].duration / 60 / 10)}${Math.floor(queue[pos].duration / 60) % 10}`;
    let m = `${Math.floor(queue[pos].duration % 60 / 10)}${queue[pos].duration % 60 % 10}`;

    let response = new MessageEmbed()
        .setTitle(`${pos + 1}. ${queue[pos].title.slice(0, 50)}`)
        .setDescription(`${h}:${m}`)
        .setURL(queue[pos].url);

    for (let i = page * 10; i < Math.min(queue.length, (page + 1) * 10); i++) {
        const track = queue[i];

        const h = `${Math.floor(track.duration / 60 / 10)}${Math.floor(track.duration / 60) % 10}`;
        const m = `${Math.floor(track.duration % 60 / 10)}${track.duration % 60 % 10}`;

        response.addField(`${i + 1}. ${track.title.slice(0, 35)}`, `${h}:${m}\n`, true);

    }
    return response;
}
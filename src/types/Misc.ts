import { track } from "./interfaces";

export function random_shuffle(array: Array<any>) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function generateQueue(queue: track[], page: number, pos: number): string {
    let response: string = "```ml\n";

    for (let i = page * 11; i < Math.min(queue.length, (page + 1) * 11); i++) {
        const track = queue[i];

        if (i === pos)
            response += `${i + 1}. ${'Current =>' + track.title.slice(0, 35).padEnd(45, " ")} ${track.duration / 60}:${track.duration % 60}\n`;
         else 
            response += `${ i + 1 }. ${track.title.slice(0, 35).padEnd(45, " ")} ${track.duration / 60}:${track.duration % 60}\n`;

    }

    response += '```';

    return response;
}
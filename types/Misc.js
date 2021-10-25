"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueue = exports.random_shuffle = void 0;
function random_shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
exports.random_shuffle = random_shuffle;
function generateQueue(queue, page, pos) {
    let response = "```ml\n";
    for (let i = page * 11; i < Math.min(queue.length, (page + 1) * 11); i++) {
        const track = queue[i];
        if (i === pos)
            response += `${i + 1}. Current => ${track.title.slice(0, 35).padEnd(45, " ")} ${Math.floor(parseInt(track.duration) / 60)}:${parseInt(track.duration) % 60}\n`;
        else
            response += `${i + 1}. ${track.title.slice(0, 35).padEnd(45, " ")} ${Math.floor(parseInt(track.duration) / 60)}:${parseInt(track.duration) % 60}\n`;
    }
    response += '```';
    return response;
}
exports.generateQueue = generateQueue;
//# sourceMappingURL=Misc.js.map
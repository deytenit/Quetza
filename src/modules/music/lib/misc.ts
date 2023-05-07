import { time } from "discord.js";

import { LoopOption } from "./types.js";

const PLAYBACK_LENGTH = 15;

export function statusBarGenerator(playback: number, duration: number): string {
    const filled = Array<string>(
        Math.floor((PLAYBACK_LENGTH * playback) / (duration === 0 ? 1 : duration))
    ).fill("🔹");

    const empty = Array<string>(
        PLAYBACK_LENGTH - Math.floor((PLAYBACK_LENGTH * playback) / (duration === 0 ? 1 : duration))
    ).fill("▫️");

    return `**[${filled.join("")}${empty.join("")}] ${time(playback, "T")}/${time(
        duration,
        "T"
    )}**`;
}

export async function asleep(amount: number): Promise<unknown> {
    return new Promise((r) => setTimeout(r, amount));
}

export function volumeMoji(amount: number): string {
    return amount > 100 ? "🔊" : amount > 50 ? "🔉" : amount > 0 ? "🔈" : "🔇";
}

export function loopMoji(loop: LoopOption): string {
    return loop === "AUTO" ? "🔀" : loop === "LOOP" ? "🔁" : loop === "NONE" ? "⤵️" : "🔂";
}

export function largestCommonSequence(s1: string, s2: string) {
    s1 = s1.toLowerCase().slice(0, 100);
    s2 = s2.toLowerCase().slice(0, 100);

    const buffer = Array.from(Array(s1.length + 1), () => new Array<number>(s2.length + 1).fill(0));

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                buffer[i][j] = buffer[i - 1][j - 1] + 1;
            } else {
                buffer[i][j] = Math.max(buffer[i - 1][j], buffer[i][j - 1]);
            }
        }
    }

    return buffer[s1.length][s2.length];
}

import { loopOption } from "./Types";

export function statusBarGenerator(duration: number, length: number): string {
    duration = Math.max(0, duration);
    length = Math.max(0, length);
    if (duration > length) duration = length;
    const filled = Array<string>(Math.floor(15 * duration / (length === 0 ? 1 : length))).fill(":small_blue_diamond:");
    const empty = Array<string>(15 - Math.floor(15 * duration / (length === 0 ? 1 : length))).fill(":white_small_square:");

    return `**[${filled.join("")}${empty.join("")}] ${secToISO(duration)}/${secToISO(length)}**`;
}

export function secToISO(amount: number): string {
    const h = Math.floor(amount / 3600);
    const m = Math.floor(amount % 3600 / 60);
    const s = Math.floor(amount % 3600 % 60);

    const hDisplay = h > 0 ? `${h}:` : "";
    const mDisplay = `${Math.floor(m / 10)}${Math.floor(m % 10)}:`;
    const sDisplay = `${Math.floor(s / 10)}${Math.floor(s % 10)}`;
    return hDisplay + mDisplay + sDisplay; 
}

export async function asleep(amount: number): Promise<unknown> {
    return new Promise(r => setTimeout(r, amount));
}

export function volumeMoji(amount: number): string {
    return amount > 100 ? "🔊" : amount > 50 ? "🔉" : amount > 0 ? "🔈" : "🔇"; 
}

export function loopMoji(loop: loopOption): string {
    return loop === "AUTO" ? "🔀" : loop === "LOOP" ? "🔁" : loop === "NONE" ? "⤵️" : "🔂"; 
}
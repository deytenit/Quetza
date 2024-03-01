import { AudioResource } from "@discordjs/voice";

import { LoopOption, Track } from "./types.js";

/**
 * Length of playback status bar in emoji symbols.
 *
 * @intenal
 */
const STATUSBAR_LENGTH = 15;

/**
 * Generates pretty playback status bar out of {@link AudioResource}.
 *
 * @remarks Takes duration and current playback duration to 'draw' bar.
 *
 * @returns String representing generated status bar.
 *
 * @param resource - AudioResource with {@link Track} metadata, so duration and playback duration is available.
 *
 * @privateRemarks I don't know why resource can be undefined - I forgor.
 *
 * @public
 */
export function statusBarGenerator(resource?: AudioResource<Track>): string {
    const duration = resource?.metadata.duration || 1;
    const playback = Math.min((resource?.playbackDuration || 0) / 1000, duration);

    const filled = Array<string>(Math.floor((STATUSBAR_LENGTH * playback) / duration)).fill("🔹");

    const empty = Array<string>(STATUSBAR_LENGTH - filled.length).fill("▫️");

    return `[${filled.join("")}${empty.join("")}] ${toISOTime(playback)}/${toISOTime(duration)}`;
}

/**
 * Converts seconds to ISO time string.
 *
 * @returns String representing given seconds in ISO format.
 *
 * @param amount - Seconds to convert.
 *
 * @example
 * ```
 * toISOTime(1337228); // "371:27:08"
 * ```
 *
 * @public
 */
export function toISOTime(amount: number): string {
    const h = Math.floor(amount / 3600);
    const m = Math.floor((amount % 3600) / 60);
    const s = Math.floor((amount % 3600) % 60);

    const hDisplay = h > 0 ? `${h}:` : "";
    const mDisplay = `${Math.floor(m / 10)}${Math.floor(m % 10)}:`;
    const sDisplay = `${Math.floor(s / 10)}${Math.floor(s % 10)}`;

    return hDisplay + mDisplay + sDisplay;
}

/**
 * Asynchronous timeout.
 *
 * @returns Promise that will be settled after timeout pass.
 *
 * @param amount - Milliseconds to wait before settle.
 *
 * @public
 */
export async function asleep(amount: number): Promise<unknown> {
    return new Promise((r) => setTimeout(r, amount));
}

/**
 * Converts volume value to emoji representation.
 *
 * @remarks In span of 0 ... 100 - emoji from muted to loud.
 *
 * @returns String with single emoji representing specified volume.
 *
 * @param amount - volume to convert.
 *
 * @public
 */
export function volumeMoji(amount: number): string {
    return amount > 100 ? "🔊" : amount > 50 ? "🔉" : amount > 0 ? "🔈" : "🔇";
}

/**
 * Converts {@link LoopOption} to emoji representation..
 *
 * @returns String with single emoji representing specified loop option.
 *
 * @param loop - Loop option that will be converted.
 *
 * @public
 */
export function loopMoji(loop: LoopOption): string {
    return loop === "AUTO" ? "🔀" : loop === "LOOP" ? "🔁" : loop === "NONE" ? "⤵️" : "🔂";
}

/**
 * Finds larges common sequence (LCS) of characters withing provided strings.
 *
 * @remarks Used to fuzzy search query title of Track.
 *
 * @returns Length of the LCS found.
 *
 * @param s1 - First string.
 * @param s2 - Second string.
 *
 * @public
 */
export function largestCommonSequence(s1: string, s2: string): number {
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

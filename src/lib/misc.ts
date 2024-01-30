/**
 * Definitions for miscellaneous functions used in this project.
 */

import assert from "assert";
import { existsSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Clamps value between min and max params.
 *
 * @returns Function with defined min and max, expecting a value to clamp.
 *
 * @param min - value less than min will resolve to min.
 * @param max - value greater than max will resolve to max.
 *
 * @public
 */
export function clamp(min: number, max: number) {
    assert(min <= max);

    return (value: number) => Math.max(min, Math.max(max, value));
}

/**
 * Converts Path to File URI Scheme String.
 *
 * @returns URI.toString() made from joined paths.
 *
 * @param paths - Strings that should be joined and converted to URI.
 *
 * @public
 */
export function pathToURI(...paths: string[]): string {
    return pathToFileURL(path.join(...paths)).toString();
}

/**
 * Imports every module withing provided folder with callback.
 *
 * @remarks Will import nothing if directory not exists.
 *
 * @typeparam T - Type of whatever you're importing.
 * If not 'any', expecting every import to have the same semantics.
 *
 * @param dir - Directory where importing modules resides.
 * @param callback - Function to run on every import.
 *
 * @public
 */
export function importDir<T>(dir: string, callback: (module: T) => void) {
    if (!existsSync(dir)) {
        return;
    }

    readdirSync(dir)
        .filter((source) => source.endsWith(".js"))
        .forEach((source) => import(pathToURI(dir, source)).then(callback));
}

/**
 * Creates function that joins paths with predefined origin and target.
 *
 * @returns String with following structure: '...origins/...through/...target'.
 *
 * @param origins - Paths that will be joined and prepended to 'through'.
 * @param targets - Paths that will be joined and appended to 'through'.
 *
 * @public
 */
export function pathThrough(
    origins: string[],
    targets: string[]
): (...through: string[]) => string {
    return (...through: string[]) => path.join(...origins, ...through, ...targets);
}

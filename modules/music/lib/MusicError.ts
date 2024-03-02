/**
 * @see ../../../src/lib/error.ts
 */

import QuetzaError from "$lib/error.js";

export default class MusicError extends QuetzaError {
    public static readonly PREFIX = "MZ";

    constructor(msg: string, code: number) {
        super(msg, code, MusicError.PREFIX);
    }
}

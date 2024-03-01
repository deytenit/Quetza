import { execFile } from "child_process";
import path from "path";
import prismMedia from "prism-media";
import { Readable } from "stream";
import { promisify } from "util";

import config from "$config.js";
import logger from "$lib/logger.js";
import MusicError from "$mlib/MusicError.js";

import { DlpDump, DlpInfo, dlpStreamOptions } from "../types.js";
import extractors from "./extractors.js";

const { FFmpeg } = prismMedia;
const execFileAsync = promisify(execFile);

/**
 * Maximum length of dlp search stack.
 *
 * @internal
 */
const DLPINFO_DEPTH = 3;

/**
 * Path to the Dlp binary.
 *
 * @internal
 */
const DLP_BINARY = path.join(config.path.binaries, "/yt-dlp");

/**
 * Base arguments for Ffmpeg transcoder.
 *
 * @internal
 */
const FFMPEG_BASE_ARGS = [
    "-analyzeduration",
    "0",
    "-loglevel",
    "0",
    "-acodec",
    "libopus",
    "-f",
    "opus",
    "-ar",
    "48000",
    "-ac",
    "2"
];

/**
 * Predicate to check whether is string a valid URL.
 *
 * @returns true if given string is a valid URL, false otherwise
 *
 * @param str - Any string
 *
 * @internal
 */
function isURL(str: string): boolean {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
        str
    );
}

/**
 * Sub-function of dlpInfo.
 *
 * @tutorial Shall be used only inside original function
 *
 * @returns Info of the media that related to query, and ones that cannot be found
 *
 * @param query - Dlp search request or compatible URL
 * @param depth - Recursion depth (force stops at 0)
 *
 * @internal
 */
async function dlpInfoRecursive(query: string, depth = DLPINFO_DEPTH): Promise<DlpInfo> {
    const error = (message: string, reason: number, ...meta: unknown[]): DlpInfo => {
        logger.warn(message, { reason, query, ...meta });
        throw new MusicError(message, reason);
    };

    if (!depth) {
        return error("Dlp: recursion depth reached", 1010);
    }

    const subprocess = await execFileAsync(DLP_BINARY, [
        query,
        "-O",
        "%(.{id,original_url,title,uploader,duration,extractor_key,thumbnail})j",
        "-s",
        "--flat-playlist"
    ]);

    if (!subprocess.stdout) {
        return error("Dlp: no stdout", 1011);
    }

    if (subprocess.stderr) {
        return error("Dlp: stderr", 1012, {
            stderr: subprocess.stderr
        });
    }

    const dumps: DlpDump[] = subprocess.stdout
        .trim()
        .split("\n")
        .map((out) => JSON.parse(out));

    const resolveDump = async (dump: DlpDump): Promise<DlpInfo> => {
        if (!Object.hasOwn(extractors, dump.extractor_key)) {
            error("Dlp: illegal extractor", 1013);
        }

        return extractors[dump.extractor_key](dump, (subquery: string) =>
            dlpInfoRecursive(subquery, depth - 1)
        );
    };

    const result = await Promise.all(dumps.map(resolveDump));

    return result.flat();
}

/**
 * Leverages dlp to fetch metadata of media accessible by the extractors.
 *
 * @returns Metadata to a youtube video that related to query by title or URL of findings
 *
 * @param query - Dlp search request or compatible URL
 *
 * @public
 */
export async function dlpInfo(query: string): Promise<DlpInfo> {
    return await dlpInfoRecursive(isURL(query) ? query : "ytsearch1:" + query);
}

/**
 * Creates Opus stream by downloading media via dlp.
 *
 * @returns Readable stream of requested media
 *
 * @param url - Dlp compatible URL to the requested resource
 * @param options - Transcoders and dlp options
 *
 * @public
 */
export function dlpStream(url: string, options?: dlpStreamOptions): Promise<Readable> {
    let ffmpegArgs = FFMPEG_BASE_ARGS;

    if (options?.seek) {
        ffmpegArgs.unshift("-ss", options.seek.toString());
    }

    if (options?.ffmpeg) {
        ffmpegArgs = ffmpegArgs.concat(options.ffmpeg);
    }

    return new Promise<Readable>((resolve, reject) => {
        const subprocess = execFile(
            DLP_BINARY,
            [
                url,
                "-o",
                "-",
                "--verbose",
                "-f",
                "bestaudio[ext=webm][acodec=opus][asr=48000]/bestaudio",
                "--rm-cache-dir",
                "-r",
                "1M"
            ],
            { encoding: null, maxBuffer: 25000000 }
        );

        if (!subprocess.stdout || !subprocess.stderr) {
            throw new Error("No stdout");
        }

        const ffmpegTranscoder = new FFmpeg({ args: ffmpegArgs });

        const stream = subprocess.stdout.pipe(ffmpegTranscoder);

        const onError = (err: Error) => {
            if (!subprocess.killed) {
                subprocess.kill();
            }
            reject(err);
            stream.resume();
        };

        subprocess
            .once("spawn", () => {
                resolve(stream);
            })
            .on("error", onError);
    });
}

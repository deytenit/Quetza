import { execFile } from "child_process";
import path from "path";
import prismMedia from "prism-media";
import { Readable } from "stream";
import { promisify } from "util";

import config from "../../../../config.js";
import logger from "../../../../lib/logger.js";
import { DlpDump, DlpInfo, dlpStreamOptions } from "../types.js";
import extractors, { isDlpExtractorKey } from "./extractors.js";

const { FFmpeg } = prismMedia;
const execFileAsync = promisify(execFile);

/**
 * Maximum length of dlp search stack.
 */
const DLPINFO_DEPTH = 5;

/**
 * Predicate to check whether is string a valid URL.
 *
 * @returns true if given string is a valid URL, false otherwise
 *
 * @param str - Any string
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
 */
async function dlpInfoRecursive(query: string, depth = DLPINFO_DEPTH): Promise<DlpInfo> {
    const error = (message: string, reason: number, ...meta: unknown[]): DlpInfo => {
        logger.warn(message, { reason, query, ...meta });
        return [[], [{ query, reason }]];
    };

    if (!depth) {
        return error("Dlp: recursion depth reached", 408);
    }

    const subprocess = await execFileAsync(path.join(config.binariesDir, "/yt-dlp"), [
        query,
        "-O",
        "%(.{id,original_url,title,uploader,duration,extractor_key,thumbnail})j",
        "-s",
        "--flat-playlist"
    ]);

    if (!subprocess.stdout) {
        return error("Dlp: no stdout", 400);
    }

    if (subprocess.stderr) {
        return error("Dlp: stderr", 500, {
            stderr: subprocess.stderr
        });
    }

    const dumps: DlpDump[] = JSON.parse("[" + subprocess.stdout.replace(/\n(?=.+)/g, ",") + "]");

    const resolveDump = async (dump: DlpDump): Promise<DlpInfo> => {
        if (!isDlpExtractorKey(dump.extractor_key)) {
            throw new Error("Dlp: illegal extractor");
        }

        return extractors[dump.extractor_key](dump, (subquery: string) =>
            dlpInfoRecursive(subquery, depth - 1)
        );
    };

    const result = await Promise.all(dumps.map(resolveDump)).catch((err: Error): DlpInfo[] => {
        return [error(err.message, 417, { query })];
    });

    return result.reduce(
        (prev, curr) => [prev[0].concat(curr[0]), prev[1].concat(curr[1])],
        [[], []]
    );
}

/**
 * Leverages dlp to fetch metadata of media accessible by the extractors.
 *
 * @returns Metadata to a youtube video that related to query by title or URL of findings
 *
 * @param query - Dlp search request or compatible URL
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
 */
export function dlpStream(url: string, options?: dlpStreamOptions) {
    let ffmpegArgs: string[] = [
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

    if (options?.seek) {
        ffmpegArgs.unshift("-ss", options.seek.toString());
    }

    if (options?.ffmpeg) {
        ffmpegArgs = ffmpegArgs.concat(options.ffmpeg);
    }

    return new Promise<Readable>((resolve, reject) => {
        const subprocess = execFile(
            path.join(config.binariesDir, "/yt-dlp"),
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

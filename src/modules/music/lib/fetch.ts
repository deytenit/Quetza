import { execFile } from "child_process";
import path from "path";
import prismMedia from "prism-media";
import { Duplex, Readable } from "stream";
import { promisify } from "util";
import ytdl from "ytdl-core";

import config from "../../../config.js";
import logger from "../../../lib/logger.js";
import { StreamOptions, YtdlDump, YtdlResult, YtdlStreamOptions } from "./types.js";

const { opus: Opus, FFmpeg } = prismMedia;
const execFileAsync = promisify(execFile);

const SEARCH_DEPTH = 5;
const YTDL_EVENTS = [
    "info",
    "progress",
    "abort",
    "request",
    "response",
    "error",
    "redirect",
    "retry",
    "reconnect"
];

function isURL(url: string): boolean {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
        url
    );
}

async function fetchInfoRecursive(query: string, depth = 0): Promise<YtdlResult[]> {
    if (depth === SEARCH_DEPTH) {
        logger.warn("yt-dlp failed to find anything.", { query });

        return [];
    }

    const executable = await execFileAsync(path.join(config.binariesDir, "/yt-dlp"), [
        query,
        "-O %(.{id,original_url,title,uploader,duration,extractor_key,thumbnail})j",
        "-s",
        "--flat-playlist"
    ]);

    const dump: YtdlDump[] = JSON.parse("[" + executable.stdout.replace(/\n(?=.+)/g, ",") + "]");

    const result: YtdlResult[] = [];

    for (const entry of dump) {
        if (entry.title && entry.thumbnail && entry.duration && entry.extractor_key === "Youtube") {
            result.push({
                url: entry.original_url,
                title: entry.title,
                thumbnail: entry.thumbnail,
                duration: entry.duration
            });

            logger.info("yt-dlp has found corresponding youtube video.", {
                result: result[result.length - 1]
            });

            continue;
        }

        let unwind: YtdlResult[];

        if (entry.extractor_key !== "Youtube" && entry.title) {
            unwind = await fetchInfoRecursive(
                `ytsearch1:${entry.uploader ? entry.uploader + " - " : ""} ${entry.title}`,
                depth + 1
            );
        } else {
            unwind = await fetchInfoRecursive(entry.original_url, depth + 1);
        }

        if (unwind.length !== 0) {
            result.push(unwind[0]);
        }
    }

    return result;
}

export async function fetchInfo(query: string): Promise<YtdlResult[]> {
    logger.info("yt-dlp was invoked.", { query });

    try {
        if (!isURL(query)) {
            return await fetchInfoRecursive("ytsearch1:" + query);
        }

        return await fetchInfoRecursive(query);
    } catch (error) {
        logger.error("yt-dlp execution invoked error.", { error });

        return [];
    }
}

export function ytdlStream(url: string, options?: YtdlStreamOptions) {
    logger.info("Created ytdl stream.", { url, options });

    let ffmpegArgs: string[] = [
        "-analyzeduration",
        "0",
        "-loglevel",
        "0",
        "-f",
        `${options?.fmt ? options.fmt : "s16le"}`,
        "-ar",
        "48000",
        "-ac",
        "2"
    ];

    if (options?.seek) {
        ffmpegArgs.unshift("-ss", options.seek.toString());
    }

    if (options?.encoderArgs) {
        ffmpegArgs = ffmpegArgs.concat(options.encoderArgs);
    }

    const transcoder = new FFmpeg({
        args: ffmpegArgs
    });

    const inputStream = ytdl(url, options);
    const transcoderStream = inputStream.pipe(transcoder);

    if (options && !options.opusEncoded) {
        YTDL_EVENTS.forEach((event) =>
            inputStream.on(event, (...args) => transcoderStream.emit(event, ...args))
        );
        inputStream.on("error", () => transcoder.destroy());
        transcoderStream.on("close", () => transcoder.destroy());

        return transcoderStream;
    }

    const opus = new Opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    });

    const outputStream = transcoderStream.pipe(opus);

    transcoderStream.on("error", (e) => outputStream.emit("error", e));

    YTDL_EVENTS.forEach((event) =>
        inputStream.on(event, (...args) => outputStream.emit(event, ...args))
    );

    outputStream.on("close", () => {
        transcoder.destroy();
        opus.destroy();
    });

    return outputStream;
}

export function arbitraryStream(stream: string | Readable | Duplex, options?: StreamOptions) {
    logger.info("Created arbitrary stream.", { stream, options });

    let ffmpegArgs: string[];

    if (typeof stream === "string") {
        ffmpegArgs = [
            "-reconnect",
            "1",
            "-reconnect_streamed",
            "1",
            "-reconnect_delay_max",
            "5",
            "-i",
            stream,
            "-analyzeduration",
            "0",
            "-loglevel",
            "0",
            "-f",
            `${options?.fmt ? options.fmt : "s16le"}`,
            "-ar",
            "48000",
            "-ac",
            "2"
        ];
    } else {
        ffmpegArgs = [
            "-analyzeduration",
            "0",
            "-loglevel",
            "0",
            "-f",
            `${options?.fmt ? options.fmt : "s16le"}`,
            "-ar",
            "48000",
            "-ac",
            "2"
        ];
    }

    if (options?.seek) {
        ffmpegArgs.unshift("-ss", options.seek.toString());
    }

    if (options?.encoderArgs) {
        ffmpegArgs = ffmpegArgs.concat(options.encoderArgs);
    }

    let transcoder = new FFmpeg({
        args: ffmpegArgs
    });

    if (typeof stream !== "string") {
        transcoder = stream.pipe(transcoder);

        stream.on("error", () => transcoder.destroy());
    }

    if (options && !options.opusEncoded) {
        transcoder.on("close", () => transcoder.destroy());

        return transcoder;
    }

    const opus = new Opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    });

    const outputStream = transcoder.pipe(opus);

    outputStream.on("close", () => {
        transcoder.destroy();
        opus.destroy();
    });

    return outputStream;
}

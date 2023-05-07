import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

import config from "../../../config.js";

const execFileAsync = promisify(execFile);

const SEARCH_DEPTH = 5;

function isURL(url: string): boolean {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
        url
    );
}

interface YtdlDump {
    id: string;
    original_url: string;
    title?: string;
    uploader?: string;
    duration?: number;
    extractor_key: string;
    thumbnail?: string;
}

interface YtdlResult {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
}

async function fetchInfoRecursive(query: string, depth = 0): Promise<YtdlResult[]> {
    if (depth === SEARCH_DEPTH) {
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
    if (!isURL(query)) {
        return await fetchInfoRecursive("ytsearch1:" + query);
    } else {
        return await fetchInfoRecursive(query);
    }
}

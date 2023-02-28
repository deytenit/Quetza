import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

import config from "../../../config.js";
import { YtdlArgs, YtdlResponse } from "./types.js";

const execFileAsync = promisify(execFile);

function argumentsResolver(args: YtdlArgs): string[] {
    const options = Object.entries(args);
    return options.map(([key, value]) => {
        if (typeof value === "boolean" && value) {
            return `--${key.split(/(?=[A-Z])/).join("-")}`.toLowerCase();
        } else {
            return `--${key.split(/(?=[A-Z])/).join("-")}=${value}`.toLowerCase();
        }
    });
}

async function ytdlExec(query: string, args: YtdlArgs): Promise<YtdlResponse | undefined> {
    try {
        const executable = await execFileAsync(
            path.join(config.binariesDir, "/youtube-dl"),
            [query].concat(argumentsResolver(args))
        );
        return JSON.parse(executable.stdout);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function fetchStream(
    query: string,
    args: YtdlArgs
): Promise<YtdlResponse | undefined> {
    let response = await ytdlExec(query, args);

    if (response && !response.extractor.includes("youtube")) {
        response = await ytdlExec(`${response.title} - ${response.creator}`, args);
    }

    return response;
}

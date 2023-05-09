import { User } from "discord.js";
import { downloadOptions } from "ytdl-core";

export interface Track {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
    requester: User;
}

export type LoopOption = "LOOP" | "SONG" | "NONE" | "AUTO";

export interface YtdlDump {
    id: string;
    original_url: string;
    title?: string;
    uploader?: string;
    duration?: number;
    extractor_key: string;
    thumbnail?: string;
}

export interface YtdlResult {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
}

export interface YtdlStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: string[];
    fmt?: string;
    opusEncoded?: boolean;
}

export interface StreamOptions {
    seek?: number;
    encoderArgs?: string[];
    fmt?: string;
    opusEncoded?: boolean;
}

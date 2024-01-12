import { User } from "discord.js";

import { dlpExtractorsValues } from "./fetch/extractors";

export interface LostTrack {
    query: string;
    reason: number;
}

export interface TrackBase {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
}

export interface Track extends TrackBase {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
    requester: User;
}

export type DlpInfo = [TrackBase[], LostTrack[]];

export type LoopOption = "LOOP" | "SONG" | "NONE" | "AUTO";

export type dlpExtractorKey = (typeof dlpExtractorsValues)[number];

export interface DlpDump {
    id: string;
    original_url: string;
    webpage_url?: string;
    title?: string;
    duration?: number;
    thumbnail?: string;
    extractor_key: dlpExtractorKey;
}

export interface dlpStreamOptions {
    seek?: number;
    ffmpeg?: string[];
}

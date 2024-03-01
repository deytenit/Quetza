import { User } from "discord.js";

import { dlpExtractorsValues } from "./fetch/extractors.js";

/**
 * Track information fetched by Dlp.
 *
 * @public
 */
export interface TrackBase {
    /** URL of track. */
    url: string;

    /** Track title. */
    title: string;

    /** Link to track thumbnail. */
    thumbnail: string;

    /** Track duration in seconds. */
    duration: number;
}

/**
 * Track information with {@link User} that requested it.
 *
 * @public
 */
export interface Track extends TrackBase {
    /** User requested this track. */
    requester: User;
}

/**
 * Player loop options.
 *
 * @remarks LOOP - Looping queue;
 *          SONG - Looping single song;
 *          NONE - Stops after queue end; (default)
 *          AUTO - Random order;
 *
 * @public
 */
export type LoopOption = "LOOP" | "SONG" | "NONE" | "AUTO";

/**
 * Dlp fetched track list.
 *
 * @public
 */
export type DlpInfo = TrackBase[];

/**
 * Dlp supported extractors as types.
 *
 * @public
 */
export type dlpExtractorKey = (typeof dlpExtractorsValues)[number];

/**
 * Actual Dlp dump that later translates to {@link DlpInfo}.
 *
 * @public
 */
export interface DlpDump {
    /** Id of resource. */
    id: string;

    /** URL passed to Dlp or link to resource found. */
    original_url: string;

    /** Link to webpage of resource requested. */
    webpage_url?: string;

    /** Resource title. */
    title?: string;

    /** Resource duration in seconds. */
    duration?: number;

    /** Link to resource thumbnail. */
    thumbnail?: string;

    /** Resource's extractor identifier. */
    extractor_key: dlpExtractorKey;
}

/**
 * Options that shall be passed to DlpStream function.
 *
 * @public
 */
export interface dlpStreamOptions {
    /** Amount of seconds to start playback from. */
    seek?: number;

    /** Args for FFMPEG transcoder. */
    ffmpeg?: string[];
}

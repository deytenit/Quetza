import { User } from "discord.js";

export interface track {
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
    requester: User;
}

export interface saveEntry {
    description: string,
    owner: string,
    tracks: track[]
}

export type loopOption = "LOOP" | "SONG" | "NONE" | "AUTO";
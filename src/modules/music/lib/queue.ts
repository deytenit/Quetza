import { LoopOption, Track } from "./types.js";

export default class Queue {
    private entries: Track[] = [];
    public get tracks(): Track[] {
        return this.entries;
    }

    private currentIndex = 0;
    public get position(): number {
        return this.currentIndex;
    }

    private loopStatus: LoopOption = "NONE";
    public get loop(): LoopOption {
        return this.loopStatus;
    }
    public set loop(x: LoopOption) {
        this.loopStatus = x;
    }

    private overallDuration = 0;
    public get duration(): number {
        return this.overallDuration;
    }

    public next(): Track | undefined {
        if (this.loopStatus === "SONG") {
            return this.current();
        }

        if (this.loopStatus === "AUTO") {
            this.currentIndex = Math.floor(Math.random() * this.entries.length);
            return this.current();
        }

        if (this.currentIndex + 1 < this.entries.length) {
            this.currentIndex++;
            return this.current();
        } else if (this.loopStatus === "LOOP") {
            this.currentIndex = 0;
            return this.current();
        } else if (this.loopStatus === "NONE") {
            this.currentIndex = 0;
            return undefined;
        }
    }

    public shuffle(): void {
        let currentIndex = this.entries.length;

        while (currentIndex != 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.entries[currentIndex], this.entries[randomIndex]] = [
                this.entries[randomIndex],
                this.entries[currentIndex]
            ];
        }

        this.currentIndex = 0;
    }

    public push(tracks: Track[], index?: number): Track {
        if (!index || index >= this.entries.length) {
            this.entries = this.entries.concat(tracks);
        } else {
            this.entries.splice(Math.max(0, index), 0, ...tracks);
            if (this.currentIndex >= index) {
                this.currentIndex += tracks.length;
            }
        }

        for (const track of tracks) {
            this.overallDuration += track.duration;
        }

        return this.entries[index || this.entries.length - 1];
    }

    public pop(query: number): Track | undefined {
        if (query >= 0 && query < this.entries.length) {
            const track = this.entries[query];

            this.entries.splice(query, 1);
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            this.overallDuration -= track.duration;
            return track;
        }

        return undefined;
    }

    public jump(query: number): Track | undefined {
        if (query >= 0 && query < this.entries.length) {
            const track = this.entries[query];
            this.currentIndex = query;
            return track;
        }

        return undefined;
    }

    public current(): Track {
        return this.entries[this.currentIndex];
    }

    public empty(): boolean {
        return this.entries.length === 0;
    }

    public clear(): void {
        this.entries = [];
        this.currentIndex = 0;
    }
}

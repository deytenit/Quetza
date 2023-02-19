import { loopOption, track } from "./Types.js";

export default class Queue {
    private tracks: track[] = [];
    public get Tracks(): track[] {
        return this.tracks;
    }
    private position = 0;
    public get Position(): number {
        return this.position;
    }

    private loop: loopOption = "NONE";
    public get Loop(): loopOption {
        return this.loop;
    }
    public set Loop(x: loopOption) {
        this.loop = x;
    }

    private duration = 0;
    public get Duration(): number {
        return this.duration;
    }

    public next(): track | undefined {
        if (this.loop === "SONG") return this.current();

        if (this.loop === "AUTO") {
            this.position = Math.floor(Math.random() * this.tracks.length);
            return this.current();
        }

        if (this.position + 1 < this.tracks.length) {
            this.position++;
            return this.current();
        }
        else if (this.loop === "LOOP") {
            this.position = 0;
            return this.current();
        }
        else if (this.loop === "NONE") {
            this.position = 0;
            return undefined;
        }
    }

    public shuffle(): void {
        let currentIndex = this.tracks.length;

        while (currentIndex != 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.tracks[currentIndex], this.tracks[randomIndex]] = [
                this.tracks[randomIndex],
                this.tracks[currentIndex],
            ];
        }

        this.position = 0;
    }

    public push(tracks: track[], index?: number): track {
        if (!index || index >= this.tracks.length) {
            this.tracks = this.tracks.concat(tracks);
        }
        else {
            this.tracks.splice(Math.max(0, index), 0, ...tracks);
            if (this.position >= index) this.position += tracks.length;
        }

        for (const track of tracks) {
            this.duration += track.duration;
        }

        return this.tracks[index || this.tracks.length - 1];
    }

    public pop(query: number): track | undefined {
        if (query >= 0 && query < this.tracks.length) {
            const track = this.tracks[query];

            this.tracks.splice(query, 1);
            this.position = Math.max(0, this.position - 1);
            this.duration -= track.duration;
            return track;
        }

        return undefined;
    }

    public jump(query: number): track | undefined {
        if (query >= 0 && query < this.tracks.length) {
            const track = this.tracks[query];
            this.position = query;
            return track;
        }

        return undefined;
    }

    public current(): track {
        return this.tracks[this.position];
    }

    public empty(): boolean {
        return this.tracks.length === 0;
    }

    public clear(): void {
        this.tracks = [];
        this.position = 0;
    }
}

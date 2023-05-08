import { LoopOption, Track } from "./types.js";

export default class Queue {
    private tracks_: Track[] = [];
    public get tracks(): Track[] {
        return this.tracks_;
    }

    private position_ = 0;
    public get position(): number {
        return this.position_;
    }

    private loop_: LoopOption = "NONE";
    public get loop(): LoopOption {
        return this.loop_;
    }
    public set loop(x: LoopOption) {
        this.loop_ = x;
    }

    private duration_ = 0;
    public get duration(): number {
        return this.duration_;
    }

    public next(): Track | undefined {
        if (this.loop_ === "SONG") {
            return this.current();
        }

        if (this.loop_ === "AUTO") {
            this.position_ = Math.floor(Math.random() * this.tracks_.length);
            return this.current();
        }

        if (this.position_ + 1 < this.tracks_.length) {
            this.position_++;
            return this.current();
        } else if (this.loop_ === "LOOP") {
            this.position_ = 0;
            return this.current();
        } else if (this.loop_ === "NONE") {
            this.position_ = 0;
            return undefined;
        }
    }

    public shuffle(): void {
        let currentIndex = this.tracks_.length;

        while (currentIndex != 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.tracks_[currentIndex], this.tracks_[randomIndex]] = [
                this.tracks_[randomIndex],
                this.tracks_[currentIndex]
            ];
        }

        this.position_ = 0;
    }

    public push(tracks: Track[], index?: number): Track {
        if (!index || index >= this.tracks_.length) {
            this.tracks_ = this.tracks_.concat(tracks);
        } else {
            this.tracks_.splice(Math.max(0, index), 0, ...tracks);
            if (this.position_ >= index) {
                this.position_ += tracks.length;
            }
        }

        for (const track of tracks) {
            this.duration_ += track.duration;
        }

        return this.tracks_[index || this.tracks_.length - 1];
    }

    public pop(query: number): Track | undefined {
        if (query >= 0 && query < this.tracks_.length) {
            const track = this.tracks_[query];

            this.tracks_.splice(query, 1);
            this.position_ = Math.max(0, this.position_ - 1);
            this.duration_ -= track.duration;
            return track;
        }

        return undefined;
    }

    public jump(query: number): Track | undefined {
        if (query >= 0 && query < this.tracks_.length) {
            const track = this.tracks_[query];
            this.position_ = query;
            return track;
        }

        return undefined;
    }

    public current(): Track {
        return this.tracks_[this.position_];
    }

    public empty(): boolean {
        return this.tracks_.length === 0;
    }

    public clear(): void {
        this.tracks_ = [];
        this.position_ = 0;
    }
}

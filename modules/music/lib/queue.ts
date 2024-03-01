import { LoopOption, Track } from "./types.js";

/**
 * Class of {@link ./player#Player | Player's} queue.
 *
 * @public
 */
export default class Queue {
    /**
     * Array of {@link Track | Tracks} - content of queue.
     */
    private tracks_: Track[] = [];
    public get tracks(): Track[] {
        return this.tracks_;
    }

    /**
     * Position of current playing track.
     */
    private position_ = 0;
    public get position(): number {
        return this.position_;
    }

    /**
     * Defines behavior of queue.
     *
     * @see ./types.ts for more info about values.
     */
    private loop_: LoopOption = "NONE";
    public get loop(): LoopOption {
        return this.loop_;
    }
    public set loop(x: LoopOption) {
        this.loop_ = x;
    }

    /**
     * Queue overall duration in seconds.
     */
    private duration_ = 0;
    public get duration(): number {
        return this.duration_;
    }

    /**
     * Skips current track.
     *
     * @remarks Behavior depends on loop option.
     *
     * @returns next {@link Track} or undefined if end was reached.
     */
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

    /**
     * Shuffles queue by using simple Math.random.
     */
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

    /**
     * Inserts tracks from provided array at specific index.
     *
     * @returns first {@link Track} of inserted Tracks.
     *
     * @param tracks - List of Tracks to insert to the queue.
     * @param index - Position at which insertion will be occurred.
     */
    public push(tracks: Track[], index?: number): Track {
        for (const track of tracks) {
            this.duration_ += track.duration;
        }

        if (!index || index >= this.tracks_.length) {
            this.tracks_ = this.tracks_.concat(tracks);

            return this.tracks_[this.tracks_.length - tracks.length];
        }

        this.tracks_.splice(Math.max(0, index), 0, ...tracks);
        if (this.position_ >= index) {
            this.position_ += tracks.length;
        }

        return this.tracks_[Math.max(0, index)];
    }

    /**
     * Removes {@link Track} from the queue at position specified.
     *
     * @returns Track that was deleted or undefined if not.
     *
     * @param query - Index of element that must be deleted.
     */
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

    /**
     * Assigns position new value.
     *
     * @returns {@link Track} at position specified or undefined if index out of bounds.
     */
    public jump(query: number): Track | undefined {
        if (query >= 0 && query < this.tracks_.length) {
            const track = this.tracks_[query];
            this.position_ = query;
            return track;
        }

        return undefined;
    }

    /**
     * Returns current {@link Track} (at position).
     *
     * @returns Track at internal position.
     */
    public current(): Track {
        return this.tracks_[this.position_];
    }

    /**
     * Checks if queue is empty.
     *
     * @returns True is queue is empty, False otherwise.
     */
    public empty(): boolean {
        return this.tracks_.length === 0;
    }

    /**
     * Clears entire queue and sets position to 0.
     */
    public clear(): void {
        this.tracks_ = [];
        this.position_ = 0;
    }
}

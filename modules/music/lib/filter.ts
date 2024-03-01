/**
 * Filter entry.
 *
 * @internal
 */
type filterValue = {
    /** Public well formatted name of the filter. */
    name: string;

    /** FFmpeg argument of this filter. */
    value: string;
};

/**
 * Record mapping id of filter with its {@link filterValue}.
 *
 * @internal
 */
const FILTERS: Record<string, filterValue> = {
    bassboost1x: { name: "Bassboost 1x", value: "bass=g=15:f=110:w=0.3" },
    bassboost2x: { name: "Bassboost 2x", value: "bass=g=30:f=110:w=0.3" },
    daycore: { name: "Daycore", value: "aresample=48000,asetrate=48000*0.75" },
    nightcore: { name: "Nightcore", value: "aresample=48000,asetrate=48000*1.25" },
    treble: {
        name: "Treble Boost",
        value: "firequalizer=gain_entry='entry(2500,3);entry(6300,6);entry(16000,10)'"
    }
} as const;

/**
 * Type build of {@link FILTERS} keys.
 *
 * @internal
 */
type filterPreset = keyof typeof FILTERS;

/**
 * {@link ./player#Player | Player's } filters options.
 *
 * Resolves FFMpeg transcoder arguments that tweak playback stream.
 *
 * @public
 */
export default class Filter {
    /**
     * Filter list
     */
    public static readonly FILTERS = FILTERS;

    /**
     * Active filters. Mock of {@link FILTERS} object.
     */
    private switches_ = new Map<filterPreset, filterValue>();

    /**
     * Converts active {@link filterValue | filterValues} to array.
     *
     * @returns Array of active filter values.
     */
    public toggled(): filterValue[] {
        return [...this.switches_.values()];
    }

    /**
     * Toggles filter specified. Clears them all if no arguments provided.
     *
     * @returns True if filter was toggled, False otherwise.
     *
     * @param query - filter id to toggle. Undefined to clear all.
     */
    public toggle(query?: filterPreset): boolean {
        if (!query) {
            this.switches_.clear();
            return false;
        }

        if (!this.switches_.delete(query)) {
            this.switches_.set(query, FILTERS[query]);
            return true;
        }

        return false;
    }

    /**
     * Calculates of active filter map.
     *
     * @returns Size of active filter map.
     */
    public size(): number {
        return this.switches_.size;
    }

    /**
     * Checks if there are any active filter.
     *
     * @returns size === 0 ? True : False.
     */
    public empty(): boolean {
        return this.size() === 0;
    }

    /**
     * Converts active filters to FFmpeg compatable argument.
     *
     * @returns FFmpeg compatable argument representing active filters.
     */
    public toString(): string {
        return this.toggled()
            .map((value) => value.value)
            .join(",");
    }
}

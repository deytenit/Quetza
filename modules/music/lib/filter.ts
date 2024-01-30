type filterValue = {
    name: string;
    value: string;
};

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

type filterPreset = keyof typeof FILTERS;

export default class Filter {
    public static readonly FILTERS = FILTERS;

    private switches_ = new Map<filterPreset, filterValue>();

    public toggled(): filterValue[] {
        return [...this.switches_.values()];
    }

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

    public size(): number {
        return this.switches_.size;
    }

    public empty(): boolean {
        return this.size() === 0;
    }

    public toString(): string {
        return this.toggled()
            .map((value) => value.value)
            .join(",");
    }
}

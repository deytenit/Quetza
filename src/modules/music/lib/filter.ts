export default class Filter {
    public static readonly filters = {
        "Bassboost 1.5": "bass=g=15:f=110:w=0.3",
        "bassboost 2.0": "bass=g=20:f=110:w=0.3",
        "bassboost 3.0": "bass=g=30:f=110:w=0.3",
        "8D": "apulsator=hz=0.09",
        Daycore: "aresample=48000,asetrate=48000*0.75",
        Nightcore: "aresample=48000,asetrate=48000*1.25",
        Phaser: "aphaser=in_gain=0.4",
        Tremolo: "tremolo",
        Vibrato: "vibrato=f=6.5",
        Reverse: "areverse",
        Treble: "treble=g=5",
        "Normalizer 1": "dynaudnorm=g=101",
        "Normalizer 2": "acompressor",
        "Surround Sound": "surround",
        Pulsator: "apulsator=hz=1",
        Subboost: "asubboost",
        Karaoke: "stereotools=mlev=0.03",
        Compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
        Expander:
            "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
        "Soft Limiter": "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
        Chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
        "Fade In": "afade=t=in:ss=0:d=10",
        Dimming:
            "afftfilt=\"'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'\"",
        Earrape: "channelsplit,sidechaingate=level_in=64"
    };

    private switches_ = new Set<string>();

    public toggled(): [string, string][] {
        return Object.entries(Filter.filters)
            .filter((value) => this.switches_.has(value[0]))
            .map((value) => [value[0], value[1]]);
    }

    public toggle(query?: string): boolean {
        if (!query) {
            this.switches_.clear();
            return false;
        }

        if (!this.switches_.delete(query) && Object.hasOwn(Filter.filters, query)) {
            this.switches_.add(query);
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
            .map((value) => value[1])
            .join(",");
    }
}

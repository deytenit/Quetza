export default class Filter {
    private filters: Record<string, [boolean, string]> = {
        bassboost_low: [false, "bass=g=15:f=110:w=0.3"],
        bassboost: [false, "bass=g=20:f=110:w=0.3"],
        bassboost_high: [false, "bass=g=30:f=110:w=0.3"],
        "8D": [false, "apulsator=hz=0.09"],
        vaporwave: [false, "aresample=48000,asetrate=48000*0.75"],
        nightcore: [false, "aresample=48000,asetrate=48000*1.25"],
        phaser: [false, "aphaser=in_gain=0.4"],
        tremolo: [false, "tremolo"],
        vibrato: [false, "vibrato=f=6.5"],
        reverse: [false, "areverse"],
        treble: [false, "treble=g=5"],
        normalizer: [false, "dynaudnorm=g=101"],
        normalizer2: [false, "acompressor"],
        surrounding: [false, "surround"],
        pulsator: [false, "apulsator=hz=1"],
        subboost: [false, "asubboost"],
        karaoke: [false, "stereotools=mlev=0.03"],
        flanger: [false, "flanger"],
        gate: [false, "agate"],
        haas: [false, "haas"],
        mcompand: [false, "mcompand"],
        mono: [false, "pan=mono|c0=.5*c0+.5*c1"],
        mstlr: [false, "stereotools=mode=ms>lr"],
        mstrr: [false, "stereotools=mode=ms>rr"],
        compressor: [
            false,
            "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
        ],
        expander: [
            false,
            "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
        ],
        softlimiter: [
            false,
            "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
        ],
        chorus: [false, "chorus=0.7:0.9:55:0.4:0.25:2"],
        chorus2d: [false, "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3"],
        chorus3d: [
            false,
            "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
        ],
        fadein: [false, "afade=t=in:ss=0:d=10"],
        dim: [
            false,
            "afftfilt=\"'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'\"",
        ],
        earrape: [false, "channelsplit,sidechaingate=level_in=64"],
    };

    public get Filters(): [string, string][] {
        return Object.entries(this.filters)
            .filter(value => value[1][0]).map(value => [value[0], value[1][1]]);
    }

    public toggle(filter?: string): void {
        if (!filter) {
            Object.values(this.filters).forEach((value) => {
                value[0] = false;
            });
            return;
        }

        if (Object.prototype.hasOwnProperty.call(this.filters, filter))
            this.filters[filter][0] = !this.filters[filter][0];
    }

    public toString(): string {
        return this.Filters.map(value => value[1]).join(",");
    }

    public empty(): boolean {
        return this.Filters.length === 0;
    }
}

import { readFile, readFileSync, writeFile, writeFileSync } from "fs";
import { saveEntry, track } from "./Types";


export class QueueStorage {
    private _data: Map<string, saveEntry>;

    public get data() {
        return this._data;
    }

    public constructor(path: string) {
        try {
            this._data = new Map(Object.entries(JSON.parse(readFileSync(path).toString("utf-8"))));
        }
        catch {
            this._data = new Map<string, saveEntry>();
        }
    }

    public createEntry(queue: track[], title: string, description: string, requester: string): void {
        this._data.set(title, {
            owner: requester,
            description: description,
            tracks: queue
        });
    }

    public eraseEntry(title: string): void {
        this._data.delete(title);
    }

    public getEntry(title: string): saveEntry | undefined {
        return this._data.get(title);
    }

    public saveData(path: string): boolean {
        try {
            writeFileSync(path, JSON.stringify(Object.fromEntries(this._data)));
            return true;
        }
        catch {
            return false;
        }
    }
}

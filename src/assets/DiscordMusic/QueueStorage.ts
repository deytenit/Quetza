import { readFile, readFileSync, writeFile, writeFileSync } from "fs";
import { saveEntry, track } from "./Types";

export class QueueStorage {
    private data: Map<string, saveEntry>;
    public get Data() {
        return this.data;
    }

    public constructor(path: string) {
        try {
            this.data = new Map(Object.entries(JSON.parse(readFileSync(path).toString("utf-8"))));
        }
        catch {
            this.data = new Map<string, saveEntry>();
        }
    }

    public createEntry(queue: track[], title: string, description: string, requester: string): void {
        this.data.set(title, {
            owner: requester,
            description: description,
            tracks: queue
        });
    }

    public removeEntry(title: string): void {
        this.data.delete(title);
    }

    public getEntry(title: string): saveEntry | undefined {
        return this.data.get(title);
    }

    public saveData(path: string): boolean {
        try {
            writeFileSync(path, JSON.stringify(Object.fromEntries(this.data)));
            return true;
        }
        catch {
            return false;
        }
    }
}
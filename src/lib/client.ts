import { PrismaClient } from "@prisma/client";
import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import { existsSync, lstatSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

import config from "../config.js";
import { ApplicationStatus, Command, Event, Module } from "./types.js";

const MODULE_ENTRY = "module.js";
const MODULE_COMMANDS = "commands";
const MODULE_EVENTS = "events";

export default class Client extends DiscordClient {
    public readonly commands = new Collection<string, Command>();

    public readonly events = new Collection<string, Event>();

    public readonly modules = new Collection<string, Module>();

    public readonly db = new PrismaClient();

    public constructor(options: ClientOptions) {
        super(options);

        for (const module of readdirSync(config.modulesDir)) {
            const modulePath = path.join(config.modulesDir, module);

            if (!lstatSync(modulePath).isDirectory()) {
                continue;
            }

            import(pathToFileURL(path.join(modulePath, MODULE_ENTRY)).toString()).then(
                (data: Module) => this.loadModule(data, modulePath)
            );
        }
    }

    private loadModule(data: Module, rootDir: string): void {
        function importModule(dir: string, importThen: (data: Command & Event) => void) {
            if (existsSync(dir)) {
                for (const source of readdirSync(dir)) {
                    const file = path.join(dir, source);

                    if (!lstatSync(file).isFile() || !file.endsWith(".js")) {
                        continue;
                    }

                    import(pathToFileURL(file).toString()).then(importThen);
                }
            }
        }

        importModule(path.join(rootDir, MODULE_COMMANDS), (command: Command) => {
            this.commands.set(command.data.name, command);
        });

        importModule(path.join(rootDir, MODULE_EVENTS), (event: Event) => {
            this.on(
                event.name,
                async (...eventee: unknown[]) => await event.execute(this, eventee)
            );
        });

        this.modules.set(data.name, data);
    }

    public generateApplicationStatus(): ApplicationStatus<"OK" | "UNAUTHORIZED"> {
        const modules = Array.from(this.modules.keys());
        const commands = Array.from(this.commands.keys());
        const events = Array.from(this.events.keys());

        const status: "OK" | "UNAUTHORIZED" = this.user && this.application ? "OK" : "UNAUTHORIZED";

        return {
            status,
            applicationId: this.application?.id,
            userTag: this.user?.tag,
            modules,
            commands,
            events
        };
    }
}

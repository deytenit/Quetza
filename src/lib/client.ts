import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import { existsSync, lstatSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

import config from "../config.js";
import { Command, Event, Module } from "./types.js";

const MODULE_ENTRY = "module.js";
const MODULE_COMMANDS = "commands";
const MODULE_EVENTS = "events";

export default class Client extends DiscordClient {
    public readonly commands = new Collection<string, Command>();

    public readonly modules = new Collection<string, Module>();

    public constructor(options: ClientOptions) {
        super(options);

        for (const module of readdirSync(config.modulesDir)) {
            const modulePath = path.join(config.modulesDir, module);

            if (!lstatSync(modulePath).isDirectory()) {
                continue;
            }

            import(pathToFileURL(path.join(modulePath, MODULE_ENTRY)).toString()).then(
                (data: Module) => this.loadModule(data)
            );
        }
    }

    private loadModule(data: Module): void {
        this.modules.set(data.name, data);

        const commandsDir = path.join(data.rootDir, MODULE_COMMANDS);

        if (existsSync(commandsDir)) {
            for (const source of readdirSync(commandsDir)) {
                const commandFile = path.join(commandsDir, source);

                if (!lstatSync(commandFile).isFile() || !commandFile.endsWith(".js")) {
                    continue;
                }

                import(pathToFileURL(commandFile).toString()).then((command: Command) =>
                    this.commands.set(command.data.name, command)
                );
            }
        }

        const eventsDir = path.join(data.rootDir, MODULE_EVENTS);

        if (existsSync(eventsDir)) {
            for (const source of readdirSync(eventsDir)) {
                const eventFile = path.join(eventsDir, source);

                if (!lstatSync(eventFile).isFile() || !eventFile.endsWith(".js")) {
                    continue;
                }

                import(pathToFileURL(eventFile).toString()).then((event: Event) => {
                    this.on(event.name, (...eventee: unknown[]) => event.execute(this, eventee));
                });
            }
        }
    }
}

import { PrismaClient } from "@prisma/client";
import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import { existsSync, lstatSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

import config from "../config.js";
import { Command, Event, Module, ModuleMetadata } from "./types.js";

const MODULE_ENTRY = "module.js";
const MODULE_COMMANDS = "commands";
const MODULE_EVENTS = "events";

export default class Client extends DiscordClient {
    public readonly commands = new Collection<string, Command>();

    public readonly modules = new Collection<string, ModuleMetadata>();

    public readonly db = new PrismaClient();

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
        const commands: string[] = [];
        const events: string[] = [];

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

        importModule(path.join(data.rootDir, MODULE_COMMANDS), (command: Command) => {
            this.commands.set(command.data.name, command);
            commands.push(command.data.name);
        });

        importModule(path.join(data.rootDir, MODULE_EVENTS), (event: Event) => {
            this.on(event.name, (...eventee: unknown[]) => event.execute(this, eventee));
            events.push(event.name);
        });

        this.modules.set(data.name, {
            ...data,
            commands,
            events
        });
    }

    public generateApplicationStatus(): string {
        const modulesStatus = this.modules
            .map((module) => {
                const tag = `✓ ${module.name}@${module.tag} module is loaded.`;
                const commands = module.commands.map((name) => " - " + name).join("\n");
                const events = module.events.map((name) => " - " + name).join("\n");

                return [`${tag}\n`, "commands:", `${commands}`, "events:", `${events}`].join("\n");
            })
            .join("\n" + "-".repeat(50) + "\n");

        const clientStatus =
            this.user && this.application
                ? `✓ ${this.application.id} successfully logged in as ${this.user.tag}.`
                : "✖ Application is not availiable.";

        return ["-".repeat(50), modulesStatus, "-".repeat(50), clientStatus].join("\n");
    }
}

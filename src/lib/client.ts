import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import { readdirSync } from "fs";

import config from "$config.js";
import { importDir, pathThrough } from "$lib/misc.js";
import {
    ApplicationStatus,
    Command,
    CommandBase,
    Event,
    EventBase,
    Module,
    ModuleBase
} from "$lib/types.js";

/**
 * Creating path to {@link Module | Module's} declaration file.
 *
 * @internal
 */
const toModuleDeclaration = pathThrough([config.path.modules], ["module.js"]);

/**
 * Creating path to {@link Module | Module's} commands directory.
 *
 * @internal
 */
const toModuleCommands = pathThrough([config.path.modules], ["commands"]);

/**
 * Creating path to {@link Module | Module's} events directory.
 *
 * @internal
 */
const toModuleEvents = pathThrough([config.path.modules], ["events"]);

/**
 * Bot client enchanced with module handling and database access.
 *
 * @typeparam T - True if client ready, false otherwise.
 *
 * @public
 */
export default class Client<T extends boolean = boolean> extends DiscordClient<T> {
    /**
     * Mapping command name to its {@link Command | instance}.
     */
    public readonly commands = new Collection<string, Command>();

    /**
     * Mapping event name to its {@link Event | instance}.
     */
    public readonly events = new Collection<string, Event>();

    /**
     * Mapping module name to its {@link Module | instance}.
     */
    public readonly modules = new Collection<string, Module>();

    /**
     * Constructs Quetza Client.
     *
     * @param options - Discord.js client options
     */
    public constructor(options: ClientOptions) {
        super(options);

        readdirSync(config.path.modules).forEach((module) =>
            this.importModule(
                toModuleDeclaration(module),
                toModuleCommands(module),
                toModuleEvents(module)
            )
        );
    }

    /**
     * Generates client's status by providing Bot User and Loaded Modules info.
     *
     * @returns Status of application.
     * Additional info such as Application ID provided if {@link Client} is ready.
     */
    public generateApplicationStatus(): ApplicationStatus {
        const modules = Array.from(this.modules.values());

        if (!this.isReady()) {
            return {
                applicationId: null,
                tag: null,
                modules
            };
        }

        return {
            applicationId: this.application.id,
            tag: this.user.tag,
            modules
        };
    }

    /**
     * Imports module metadata, commands and events to the client.
     *
     * @param declaration - File declaring module information.
     * @param commands - Directory containing module's commands.
     * @param events - Directory containing module's events.
     */
    private async importModule(
        declaration: string,
        commands: string,
        events: string
    ): Promise<void> {
        const module = await import(declaration).then((module: ModuleBase) =>
            this.modules.ensure(module.name, () => ({ ...module, commands: [], events: [] }))
        );

        importDir<CommandBase>(commands, (command) => {
            const saved = this.commands.ensure(command.data.name, () => ({ ...command, module }));

            module.commands.push(saved);
        });

        importDir<EventBase>(events, (event) => {
            const saved = this.events.ensure(event.name, () => ({ ...event, module }));

            module.events.push(saved);
            this.on(event.name, (...eventee: unknown[]) =>
                saved.execute(this, eventee, module.controller)
            );
        });
    }
}

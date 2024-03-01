/**
 * Quetza's base type declarations.
 *
 * @see Architecture documentation for more understanding of its purpose.
 */
import { ApplicationCommandData, CommandInteraction, If } from "discord.js";

import Client from "$lib/client.js";

/**
 * Quetza's module declaration.
 *
 * @public
 */
export interface ModuleBase {
    /** Name of a module. */
    name: string;

    /** Description of a module. */
    description: string;

    /** Module controller. */
    controller?: unknown;
}

/**
 * Complete {@link ModuleBase} declaration with commands and events.
 *
 * @public
 */
export interface Module extends ModuleBase {
    /** Module's commands. */
    commands: CommandBase[];

    /** Module's events. */
    events: EventBase[];
}

/**
 * Quetza's command interaction declaration.
 *
 * @public
 */
export interface CommandBase {
    /** Command metadata that will be passed to the Discord API. */
    data: ApplicationCommandData;

    /** Function that will be executed upon invoking this interaction. */
    execute: (
        client: Client,
        interaction: CommandInteraction,
        controller?: unknown
    ) => Promise<void>;
}

/**
 * {@link ModuleBase} with {@link Module} included.
 *
 * @public
 */
export interface Command extends CommandBase {
    /** Module containing this Command. */
    module: Module;
}

/**
 * Quetza's event declaration.
 *
 * @public
 */
export interface EventBase {
    /** Name of an event to listen. */
    name: string;

    /** Function that will be executed upon event emitting. */
    execute: (client: Client, eventee: unknown[], controller?: unknown) => Promise<void>;
}

/**
 * {@link EventBase} with {@link Module} included.
 *
 * @public
 */
export interface Event extends EventBase {
    /** Module containing this Event. */
    module: ModuleBase;
}

/**
 * Application status provides information that may be useful at initialization.
 *
 * @public
 */
export interface ApplicationStatus<Ready extends boolean = boolean> {
    /** Discord's ID of an application. */
    applicationId: If<Ready, string>;

    /** Tag of a bot user. */
    tag: If<Ready, string>;

    /** List of each module imported. */
    modules: Module[];
}

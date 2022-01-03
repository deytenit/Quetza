import { ApplicationCommandData, Client as DiscordClient, Intents, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import { quetzaConfig } from "../config";

type commandMetadata = {
    data: ApplicationCommandData,
    run: (arg0: QuetzaClient, arg1: CommandInteraction) => Promise<void>
};

type eventMetadata = {
    name: string,
    run: (arg0: QuetzaClient, arg1: unknown[]) => Promise<void>
}

type moduleMetadata = {
    data: {
        key: string,
        name: string,
        description: string,
        author: string
    },
    control: any
}

/**
 * Extended client class for bot.
 * @field commands Contains all bot commands.
 * @field players Is a music feature.
 */
export class QuetzaClient extends DiscordClient {
    private commands = new Map<string, commandMetadata>();
    private modules: Record<string, moduleMetadata> = {};

    get Commands(): Map<string, commandMetadata> {
        return this.commands;
    }

    get Modules(): Record<string, moduleMetadata> {
        return this.modules;
    }

    public constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS, 
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_VOICE_STATES
            ] 
        }); 

        quetzaConfig.modules.forEach((dir) => {
            const moduleDir = quetzaConfig.rootDir + "modules/" + dir;

            import(moduleDir + "qmodule.js")
                .then((qmodule: moduleMetadata) => this.modules[qmodule.data.key] = qmodule);

            const commandFiles = readdirSync(moduleDir + "commands").filter(file => file.endsWith(".js"));
            const eventFiles = readdirSync(moduleDir + "events").filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                import(moduleDir + "commands/" + file)
                    .then((command: commandMetadata) => this.commands.set(command.data.name, command));
            }

            for (const file of eventFiles) {
                import(moduleDir + "events/" + file).then((event: eventMetadata) => {
                    this.on(event.name, (...args: unknown[]) => {
                        event.run(this, args);
                    });
                });
            }
        });

    }
}
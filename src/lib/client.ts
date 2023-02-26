import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { existsSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

import config from "../config.js";
import Music from "./music.js";
import { command, event } from "./types.js";

export default class Client extends DiscordClient {
    private commands = new Map<string, command>();

    get Commands(): Map<string, command> {
        return this.commands;
    }

    public readonly modules = {
        music: new Music()
    };

    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
        });

        if (existsSync(config.commands)) {
            const files = readdirSync(config.commands).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                import(pathToFileURL(path.join(config.commands, file)).toString()).then(
                    (cmd: command) => this.commands.set(cmd.data.name, cmd)
                );
            }
        }

        if (existsSync(config.events)) {
            const files = readdirSync(config.events).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                import(pathToFileURL(path.join(config.events, file)).toString()).then(
                    (evnt: event) => {
                        this.on(evnt.name, (...args: unknown[]) => evnt.run(this, args));
                    }
                );
            }
        }
    }
}

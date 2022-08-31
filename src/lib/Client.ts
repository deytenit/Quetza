import {
    Client as DiscordClient
} from "discord.js";
import { existsSync, readdirSync } from "fs";
import path from "path";
import Music from "./Music";
import { command, event } from "./Types";
import config from "../config";

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
            intents: [
                "Guilds",
                "GuildMessages",
                "GuildVoiceStates",
            ],
        });

        if (existsSync(config.commands)) {
            const files = readdirSync(config.commands).filter((file) =>
                file.endsWith(".js")
            );

            for (const file of files) {
                import(path.join(config.commands, file)).then((cmd: command) =>
                    this.commands.set(cmd.data.name, cmd)
                );
            }
        }

        if (existsSync(config.events)) {
            const files = readdirSync(config.events).filter((file) =>
                file.endsWith(".js")
            );

            for (const file of files) {
                import(path.join(config.events, file)).then((evnt: event) => {
                    this.on(evnt.name, (...args: unknown[]) =>
                        evnt.run(this, args)
                    );
                });
            }
        }
    }
}

import {
    Client as DiscordClient,
    Intents,
} from "discord.js";
import { existsSync, readdirSync } from "fs";
import path from "path";
import Music from "./Music";
import { command, event } from "./Types";
import config from "../config";
import { Storage } from "./Storage";

export default class Client extends DiscordClient {
    private commands = new Map<string, command>();

    get Commands(): Map<string, command> {
        return this.commands;
    }

    public readonly modules = {
        music: new Music(),
        storage: new Storage()
    };

    public constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
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

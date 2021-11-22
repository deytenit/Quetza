import { ApplicationCommandData, Client as DiscordClient, Intents, User } from "discord.js";
import { readdirSync } from "fs";
import { Music } from "./Music";


export class MyClient extends DiscordClient {
    private _commands = new Map<string, any>();
    private _restCommands: ApplicationCommandData[] = [];
    private _owner: string;
    public players = new Music();

    get commands(): Map<string, any> {
        return this._commands;
    }

    get restCommands(): ApplicationCommandData[] {
        return this._restCommands;
    }

    get owner(): string {
        return this._owner;
    }


    public constructor(commandsPath: string, eventsPath: string, ownerId: string) {
        super({
            intents: [
                Intents.FLAGS.GUILDS, 
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_VOICE_STATES
            ] 
        }); 

        readdirSync(commandsPath).forEach((dir) => {
            const cmdFiles = readdirSync(`${commandsPath}/${dir}`).filter(file => file.endsWith(".js"));

            for (const file of cmdFiles) {
                import(`.${commandsPath}/${dir}/${file}`).then((command) => {
                    const name = command.data.name;
                    this._restCommands.push(command.data);
                    this._commands.set(name, command);
                });
            }
        });

        const evntFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));

        for (const file of evntFiles) {
            import(`.${eventsPath}/${file}`).then((event) => {
                this.on(event.name, (...args: unknown[]) => {
                    event.run(args, this);
                });
            });
        }

        this._owner = ownerId;
    }
}
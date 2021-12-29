import { ApplicationCommandData, Client as DiscordClient, Intents, User } from "discord.js";
import { readdirSync } from "fs";
import { Music } from "./DiscordMusic/Music";


export class MyClient extends DiscordClient {
    private commands = new Map<string, any>();
    private restCommands: ApplicationCommandData[] = [];
    private owner: string;
    private players = new Music();

    get Commands(): Map<string, any> {
        return this.commands;
    }

    get RestCommands(): ApplicationCommandData[] {
        return this.restCommands;
    }

    get Owner(): string {
        return this.owner;
    }

    get Players(): Music {
        return this.players;
    }


    public constructor(commandsPath: string, eventsPath: string, ownerId: string) {
        super({
            intents: [
                Intents.FLAGS.GUILDS, 
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_VOICE_STATES
            ] 
        }); 

        readdirSync(`${__dirname}/../${commandsPath}`).forEach((dir) => {
            const cmdFiles = readdirSync(`${__dirname}/../${commandsPath}/${dir}`).filter(file => file.endsWith(".js"));

            for (const file of cmdFiles) {
                import(`${__dirname}/../${commandsPath}/${dir}/${file}`).then((command) => {
                    const name = command.data.name;
                    this.restCommands.push(command.data);
                    this.commands.set(name, command);
                });
            }
        });

        const eventFiles = readdirSync(`${__dirname}/../${eventsPath}`).filter(file => file.endsWith(".js"));

        for (const file of eventFiles) {
            import(`${__dirname}/../${eventsPath}/${file}`).then((event) => {
                this.on(event.name, (...args: unknown[]) => {
                    event.run(args, this);
                });
            });
        }

        this.owner = ownerId;
    }
}
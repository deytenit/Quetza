import { ApplicationCommandData, Client as DiscordClient, Intents } from "discord.js";
import { readdirSync } from "fs";
import { Music } from "./Music";


export class MyClient extends DiscordClient {
    commands = new Map<string, any>();
    restCommands: ApplicationCommandData[] = [];
    players = new Music();


    constructor(commandsPath: string, eventsPath: string) {
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
                    this.restCommands.push(command.data);
                    this.commands.set(name, command);
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
    }
}
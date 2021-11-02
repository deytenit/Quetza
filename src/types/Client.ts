import { ApplicationCommandData, Client, Intents } from "discord.js";
import { readdirSync } from "fs";
import { Music } from "./Music";


export class MyClient extends Client {
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

        const cmdFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of cmdFiles) {
            import(`.${commandsPath}/${file}`).then((command) => {
                const name = command.data.name;
                this.restCommands.push(command.data);
                this.commands.set(name, command);
            });
        }
    }
}
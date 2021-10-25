"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClient = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const Music_1 = require("./Music");
class MyClient extends discord_js_1.Client {
    commands = new Map();
    restCommands = [];
    players = new Music_1.Music();
    constructor(commandsPath, eventsPath) {
        super({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });
        const cmdFiles = (0, fs_1.readdirSync)(commandsPath).filter(file => file.endsWith(".js"));
        for (const file of cmdFiles) {
            Promise.resolve().then(() => __importStar(require(`../commands/${file}`))).then((command) => {
                const name = command.data.name;
                this.restCommands.push(command.data);
                this.commands.set(name, command);
            });
        }
    }
}
exports.MyClient = MyClient;
//# sourceMappingURL=Client.js.map
import { Guild, TextChannel } from "discord.js";
import Player from "./Player.js";

export default class Music {
    private players = new Map<string, Player>();

    public get(guildId: string, channel?: TextChannel): Player | undefined {
        const player = this.players.get(guildId);
        if (player) {
            if (channel) player.Channel = channel;
            return player;
        }
    }

    public set(guild: Guild, channel: TextChannel): Player {
        const player = new Player(guild, this, channel);
        this.players.set(guild.id, player);

        return player;
    }

    public del(guildId: string): void {
        this.players.delete(guildId);
    }
}

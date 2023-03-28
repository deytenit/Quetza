import { Collection, Guild, TextChannel } from "discord.js";

import Player from "./player.js";

export default class Music {
    private players = new Collection<string, Player>();

    public get(guildId: string, channel?: TextChannel): Player | undefined {
        const player = this.players.get(guildId);

        if (player) {
            if (channel) {
                player.channel = channel;
            }

            return player;
        }
    }

    public set(guild: Guild, channel: TextChannel): Player {
        const player = new Player(guild, this, channel);

        this.players.set(guild.id, player);

        return player;
    }

    public delete(guildId: string): void {
        this.players.delete(guildId);
    }
}

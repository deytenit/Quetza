import { Collection, Guild, GuildTextBasedChannel } from "discord.js";

import logger from "../../../lib/logger.js";
import Player from "./player.js";

export default class Music {
    private players_ = new Collection<string, Player>();

    public get(guild: Guild, channel?: GuildTextBasedChannel): Player | undefined {
        const player = this.players_.get(guild.id);

        if (player) {
            if (channel) {
                player.channel = channel;
            }

            return player;
        }
    }

    public set(guild: Guild, channel: GuildTextBasedChannel): Player {
        const player = new Player(guild, this, channel);

        this.players_.set(guild.id, player);

        logger.info("Player was created.", { player });

        return player;
    }

    public delete(guildId: string): void {
        logger.info("Player was deleted.", { guildId });

        this.players_.delete(guildId);
    }
}

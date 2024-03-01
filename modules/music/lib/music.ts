import { Collection, Guild, GuildTextBasedChannel } from "discord.js";

import logger from "$lib/logger.js";

import Player from "./player.js";

/**
 * Module's controller.
 *
 * Binds guilds to player.
 * Creates and destroys them.
 */
export default class Music {
    /**
     * GuildId to {@link Player} mapping.
     */
    private players_ = new Collection<string, Player>();

    /**
     * Retrieves {@link Player} by {@link Guild}.
     *
     * @returns Player if such mapping exists or undefined otherwise.
     *
     * @param guild - Discord guild that might has a Player binded.
     * @param channel - Text channel that should replace Player's one.
     */
    public get(guild: Guild, channel?: GuildTextBasedChannel): Player | undefined {
        const player = this.players_.get(guild.id);

        if (player) {
            if (channel) {
                player.channel = channel;
            }

            return player;
        }
    }

    /**
     * Creates {@link Player} and maps it to GuildId.
     *
     * @returns Newly created Player.
     *
     * @param guild - {@link Guild} that created Player will be binded to.
     * @param channel - Text channel that used by Player constructor.
     */
    public set(guild: Guild, channel: GuildTextBasedChannel): Player {
        const player = new Player(guild, this, channel);

        this.players_.set(guild.id, player);

        logger.info("Player was created.", { player });

        return player;
    }

    /**
     * Deleted {@link Player} and its mapping by GuildId.
     *
     * @param guildId - Id of {@link Guild} that must be removed from mapping.
     */
    public delete(guildId: string): void {
        logger.info("Player was deleted.", { guildId });

        this.players_.delete(guildId);
    }
}

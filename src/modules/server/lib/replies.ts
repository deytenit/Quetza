import {
    BaseMessageOptions,
    bold,
    Collection,
    EmbedBuilder,
    InteractionReplyOptions,
    italic,
    Role,
    underscore,
    User
} from "discord.js";

import config from "../../../config.js";

const replies = {
    error: (): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle("Internal error occured while resolving interaction.")
            .setDescription("Submit an issue (bio). Logs were saved.")
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    notMember: (action: string, user: User): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${user.username} cannot be ${action}`)
            .setDescription("They're not a guild member.")
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    roleAction: (
        action: string,
        user: User,
        roleName: string,
        reason?: string
    ): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`Role ${roleName} was ${action} user ${user.username}`)
            .setDescription(reason ?? "No reason provided.")
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    roleList: (observed: string, roles: Collection<string, Role>): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`${observed} roles:`)
            .addFields(
                roles.map((role) => {
                    return {
                        name: role.name,
                        value: italic(role.id)
                    };
                })
            )
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    auto: (action: string, event: string): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(
                bold(
                    `From now I will ${underscore(italic(action))} when ${underscore(
                        italic(event)
                    )} event happens`
                )
            )
            .setTimestamp();

        return { embeds: [embed] };
    }
};

export default replies;

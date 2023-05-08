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

const replies = {
    action: (action: string, user: User, reason?: string): BaseMessageOptions => {
        const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(bold(`${user.tag} was ${action}`))
            .setDescription(italic(reason ?? "No reason provided."))
            .setTimestamp();

        return { embeds: [embed] };
    },
    notMember: (action: string, user: User): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(bold(`${user.tag} cannot be ${action}`))
            .setDescription(italic("They're not a guild member."))
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
            .setColor("Green")
            .setTitle(bold(`Role ${roleName} was ${action} user ${user.tag}`))
            .setDescription(italic(reason ?? "No reason provided."))
            .setTimestamp();

        return { embeds: [embed], ephemeral: true };
    },
    roleList: (observed: string, roles: Collection<string, Role>): InteractionReplyOptions => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(bold(`${observed} roles:`))
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
            .setColor("Green")
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
